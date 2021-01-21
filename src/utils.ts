export function unmaskPhone(phone: string): number
{
    try{
        return parseInt(38 + phone.replace(/\D+/g, ''));
    }catch {
        return null;
    }

}

export function phoneToMask(phone: string): string {
    try{
        return phone.substr(2);
    }catch{
        return null;
    }
}