import { NextApiRequest, NextApiResponse } from "next";
import { executeQuery } from "../../[connect]/db";
import { QueryResult } from 'pg';

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const data = await req.body;
        const { auth0_id, nickname, email } = data;

        const query = `
    INSERT INTO "Users"."Users" ("auth0_id", nickname, email, create_date)
    VALUES ($1, $2, $3, CURRENT_DATE)
    RETURNING id;`;
        const parameters = [auth0_id, nickname, email];

        const result: QueryResult = await executeQuery(query, parameters);
        console.log('Dodano użytkownika, ID: ', result.rows[0].id);
        return Response.json({ status: 200, userId: result.rows[0].id });
    } catch (error: any) {
        console.error('Błąd podczas dodawania użytkownika: ', error.message);
        return Response.json({ status: 500, error: error.message });
    }
};
