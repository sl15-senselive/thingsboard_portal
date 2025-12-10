import { pool } from "@/lib/db";

export async function GET(){
    try {
        const result = await pool.query('SELECT * FROM payments');
        return new Response(JSON.stringify(result.rows), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching payments:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}