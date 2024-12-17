import { executeQuery } from "../[connect]/db";

export const GET = async (req: Request, res: Response) => {
    try {
        const query = `    
        SELECT 
            ct.name AS city_name, 
            ctr.name AS country_name, 
            ct.code AS city_code, 
            ctr.flag_image AS flag_image, 
            ctr.phone_prefix AS country_phone_prefix, 
            ctr.lang_id AS country_lang_id, 
            ctr.time_zone AS country_time_zone, 
            ctr.travel_advisory_info AS country_travel_advisory_info, 
            ctr.cultural_norms AS country_cultural_norms, 
            ct.location AS city_location, 
            ctr.currency_code AS country_currency_code
        FROM 
            countries.city ct
        INNER JOIN 
            countries.country ctr ON ctr.code = ct.country_code
        `;

        const recordset = await executeQuery(query);
        return Response.json({ status: 200, recordset: recordset });
    } catch (error) {
        console.log("Wystąpił błąd podczas próby pobrania danych z bazy danych dla serchbox:\n",error)
        return Response.json({ status: 500, error: error });
    }
}