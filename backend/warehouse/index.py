"""Учёт прихода и расхода электроматериалов по объектам."""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    body = json.loads(event.get('body') or '{}')
    path = event.get('path', '/')

    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    # /objects — справочник объектов
    if '/objects' in path:
        if method == 'GET':
            cur.execute('SELECT * FROM objects WHERE is_active=TRUE ORDER BY name')
            rows = [dict(r) for r in cur.fetchall()]
            cur.close(); conn.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps(rows)}

        if method == 'POST':
            cur.execute(
                'INSERT INTO objects (name, address) VALUES (%s,%s) RETURNING *',
                (body.get('name',''), body.get('address',''))
            )
            row = dict(cur.fetchone())
            conn.commit(); cur.close(); conn.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps(row)}

    # /materials — справочник материалов
    if '/materials' in path:
        if method == 'GET':
            cur.execute('SELECT * FROM materials ORDER BY category, name')
            rows = [dict(r) for r in cur.fetchall()]
            cur.close(); conn.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps(rows)}

        if method == 'POST':
            cur.execute(
                'INSERT INTO materials (name, unit, category) VALUES (%s,%s,%s) RETURNING *',
                (body.get('name',''), body.get('unit','шт'), body.get('category',''))
            )
            row = dict(cur.fetchone())
            conn.commit(); cur.close(); conn.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps(row)}

    # /balance — остатки по объекту
    if '/balance' in path:
        object_id = params.get('object_id')
        sql = '''
            SELECT
              m.id as material_id, m.name, m.unit, m.category,
              COALESCE(SUM(CASE WHEN mv.movement_type='in'  THEN mv.quantity ELSE 0 END), 0) as total_in,
              COALESCE(SUM(CASE WHEN mv.movement_type='out' THEN mv.quantity ELSE 0 END), 0) as total_out,
              COALESCE(SUM(CASE WHEN mv.movement_type='in'  THEN mv.quantity
                               WHEN mv.movement_type='out' THEN -mv.quantity END), 0) as balance
            FROM materials m
            LEFT JOIN material_movements mv ON mv.material_id = m.id
        '''
        args = []
        if object_id:
            sql += ' AND mv.object_id = %s'
            args.append(object_id)
        sql += ' GROUP BY m.id, m.name, m.unit, m.category ORDER BY m.category, m.name'
        cur.execute(sql, args)
        rows = [dict(r) for r in cur.fetchall()]
        cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps(rows, default=str)}

    # /movements — журнал движений
    if method == 'GET':
        object_id = params.get('object_id')
        material_id = params.get('material_id')
        movement_type = params.get('movement_type')
        sql = '''
            SELECT mv.*, o.name as object_name, m.name as material_name, m.unit
            FROM material_movements mv
            JOIN objects o ON o.id = mv.object_id
            JOIN materials m ON m.id = mv.material_id
        '''
        conditions = []
        args = []
        if object_id:
            conditions.append('mv.object_id = %s')
            args.append(object_id)
        if material_id:
            conditions.append('mv.material_id = %s')
            args.append(material_id)
        if movement_type and movement_type != 'all':
            conditions.append('mv.movement_type = %s')
            args.append(movement_type)
        if conditions:
            sql += ' WHERE ' + ' AND '.join(conditions)
        sql += ' ORDER BY mv.moved_at DESC, mv.created_at DESC LIMIT 200'
        cur.execute(sql, args)
        rows = [dict(r) for r in cur.fetchall()]
        cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps(rows, default=str)}

    if method == 'POST':
        cur.execute('''
            INSERT INTO material_movements
              (object_id, material_id, movement_type, quantity, doc_number, note, moved_at)
            VALUES (%s,%s,%s,%s,%s,%s,%s) RETURNING *
        ''', (
            body['object_id'], body['material_id'], body['movement_type'],
            body['quantity'], body.get('doc_number',''), body.get('note',''),
            body.get('moved_at') or 'NOW()'
        ))
        row = dict(cur.fetchone())
        conn.commit(); cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps(row, default=str)}

    if method == 'PUT':
        mid = params.get('id')
        cur.execute('''
            UPDATE material_movements SET
              object_id=%s, material_id=%s, movement_type=%s,
              quantity=%s, doc_number=%s, note=%s, moved_at=%s
            WHERE id=%s RETURNING *
        ''', (
            body['object_id'], body['material_id'], body['movement_type'],
            body['quantity'], body.get('doc_number',''), body.get('note',''),
            body.get('moved_at'), mid
        ))
        row = dict(cur.fetchone())
        conn.commit(); cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps(row, default=str)}

    return {'statusCode': 405, 'headers': CORS, 'body': 'Method not allowed'}
