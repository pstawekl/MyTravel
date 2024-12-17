export type PaymentInfo = {
    id: number;
    user_id: number;
    card_number?: number;
    expiration_date?: string;
    CVV?: string;
    billing_country_code?: string;
    billing_city_id?: number;
    billing_house_number?: string;
    billing_post_code?: string;
}
export type User = {
    id: number;
    auth0_id: string;
    nickname: string;
    email: string;
    name?: string;
    surname?: string;
    birth_date?: string;
    street?: string;
    house_number?: string;
    post_code?: string;
    country?: string;
    city_id?: number;
    phone_number?: string;
    phone_country?: string;
}