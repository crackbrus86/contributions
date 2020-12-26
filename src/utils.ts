export function unmaskPhone(phone: string): number
{
    try{
        return parseInt(38 + phone.replace(/\D+/g, ''));
    }catch {
        return null;
    }

}