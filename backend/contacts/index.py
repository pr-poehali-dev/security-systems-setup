"""Управление контактами ЛПР для обзвона — получение, добавление, обновление, удаление."""
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

    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    # GET — список контактов с фильтром по статусу
    if method == 'GET':
        status = params.get('status')
        search = params.get('search', '').strip()
        sql = 'SELECT * FROM contacts'
        conditions = []
        args = []
        if status and status != 'all':
            conditions.append('status = %s')
            args.append(status)
        if search:
            conditions.append('(company_name ILIKE %s OR contact_person ILIKE %s OR phone ILIKE %s)')
            args += [f'%{search}%', f'%{search}%', f'%{search}%']
        if conditions:
            sql += ' WHERE ' + ' AND '.join(conditions)
        sql += ' ORDER BY created_at DESC'
        cur.execute(sql, args)
        rows = cur.fetchall()
        cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps([dict(r) for r in rows], default=str)}

    # POST — добавить контакт
    if method == 'POST':
        cur.execute('''
            INSERT INTO contacts (company_name, industry, address, contact_person, position, phone, phone2, email, status, comment, next_call_date)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING *
        ''', (
            body.get('company_name', ''), body.get('industry', ''), body.get('address', ''),
            body.get('contact_person', ''), body.get('position', ''),
            body.get('phone', ''), body.get('phone2', ''), body.get('email', ''),
            body.get('status', 'new'), body.get('comment', ''), body.get('next_call_date') or None
        ))
        row = dict(cur.fetchone())
        conn.commit(); cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps(row, default=str)}

    # PUT — обновить контакт
    if method == 'PUT':
        cid = params.get('id')
        cur.execute('''
            UPDATE contacts SET
              company_name=%s, industry=%s, address=%s, contact_person=%s, position=%s,
              phone=%s, phone2=%s, email=%s, status=%s, call_result=%s,
              comment=%s, next_call_date=%s, updated_at=NOW()
            WHERE id=%s RETURNING *
        ''', (
            body.get('company_name', ''), body.get('industry', ''), body.get('address', ''),
            body.get('contact_person', ''), body.get('position', ''),
            body.get('phone', ''), body.get('phone2', ''), body.get('email', ''),
            body.get('status', 'new'), body.get('call_result', ''),
            body.get('comment', ''), body.get('next_call_date') or None, cid
        ))
        row = dict(cur.fetchone())
        conn.commit(); cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps(row, default=str)}

    # DELETE — удалить контакт
    if method == 'DELETE':
        cid = params.get('id')
        cur.execute('DELETE FROM contacts WHERE id=%s', (cid,))
        conn.commit(); cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

    return {'statusCode': 405, 'headers': CORS, 'body': 'Method not allowed'}
