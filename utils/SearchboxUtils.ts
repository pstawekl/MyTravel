import { SearchboxComponent } from "../components/Searchbox";

export enum SearchboxType {
    city = "city"
}

export class SearchboxUtils {
    public static searchboxType: SearchboxType;
    public static searchboxComponent = new SearchboxComponent();
    public static searchboxList: City[] = [];

    constructor(searchboxType: SearchboxType) {
        SearchboxUtils.searchboxType = searchboxType;
    }

    public static fetchSearchboxList = async () => {
        const res = await fetch('/api/pg/searchbox');
        const data: any = await res.json();
        if (data && data.status === 200) {
            SearchboxUtils.searchboxList = data.recordset.rows.map((x: any) => ({
                name: x['city_name'],
                country: x['country_name'],
                code: x['city_code'],
                flag_image: x['flag_image'],
                phone_prefix: x['country_phone_prefix'],
                lang_id: x['country_lang_id'],
                time_zone: x['country_time_zone'],
                travel_advisory_info: x['country_travel_advisory_info'],
                cultural_norms: x['country_cultural_norms'],
                location: x['city_location'] as number[],
                currency_code: x['country_currency_code'],
            } as City));
        }
        console.log('Lista elementów w Searchboxie: ', SearchboxUtils.searchboxList);
        return SearchboxUtils.searchboxList;
    };

    public static async getSearchboxItems(searchValue: String, searchboxType: SearchboxType): Promise<any> {
        try {
            switch (searchboxType) {
                case SearchboxType.city:
                    return SearchboxUtils.searchboxList.filter((item: City) => item.name.toLowerCase().startsWith(searchValue.toLowerCase().toString()) ||
                        item.otherNames?.toLowerCase().startsWith(searchValue.toLowerCase().toString()));
                default:
                    return [];
            }
        } catch (error) {
            console.log(error);
        }
    }

    public static getSearchboxItemsByCityCode(cityCodes: String[]): City[] {
        return SearchboxUtils.searchboxList.filter((item: City) => cityCodes.map((cityCode: String) => cityCode.toLowerCase()).includes(item.code.toLowerCase()));
    }
}

export interface City {
    name?: string,
    country?: string,
    code?: string,
    otherNames?: string,
    flag_image?: string,
    phone_prefix?: string,
    lang_id?: number,
    time_zone?: string,
    travel_advisory_info?: string,
    cultural_norms?: string,
    location?: number[],
    currency_code?: string,
}