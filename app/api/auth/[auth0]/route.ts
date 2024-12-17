import { handleAuth, getSession, handleCallback, AppRouteHandlerFnContext } from '@auth0/nextjs-auth0';
import { executeQuery } from '../../pg/[connect]/db';
import { NextRequest } from 'next/server';

export const GET = handleAuth({
    callback: async (req: NextRequest, res: AppRouteHandlerFnContext) => {
        try {
            return await handleCallback(req, res, { afterCallback })
        } catch (error) {
            console.error("Wystąpił błąd podczas logowania", error);
            return Response.json({ status: 500, error: error.message })
        }
    }
});

const afterCallback = async (req, session, state) => {
    if (!session || !session.user) {
        throw new Error('Nie można uzyskać informacji o sesji użytkownika');
    }

    const user = session.user;
    const user_id = user.sub;

    try {
        const recordset = await executeQuery(`SELECT * FROM "Users"."Users" WHERE auth0_id = $1;`, [user_id]);

        if (recordset.rowCount === 0) {

            const query = `
    INSERT INTO "Users"."Users" (auth0_id, nickname, email, create_date)
    VALUES ($1, $2, $3, CURRENT_DATE)
    RETURNING id;`;
            const parameters = [user_id, user.nickname, user.name];
            await executeQuery(query, parameters);
        } else {
            const query = `
    UPDATE "Users"."Users"
    SET nickname = $1, email = $2, update_date = CURRENT_DATE
    WHERE auth0_id = $3
    RETURNING *;`;
            const parameters = [user.nickname, user.name, user_id];
            await executeQuery(query, parameters);
        }
        return session;
    } catch (error) {
        console.error('Błąd podczas komunikacji z bazą danych', error);
        return Response.json({ status: 500, error: error.message });
    }
}
