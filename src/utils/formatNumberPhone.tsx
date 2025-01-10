export function phoneNumberMaskDynamic(val: string) {
    let phoneValue = val.trim()

    phoneValue = phoneValue.replace(/\D/g, '')
    phoneValue = phoneValue.replace(/^(\d{2})(\d)/, '($1) $2')
    phoneValue = phoneValue.replace(/(\d{4,5})(\d{4})/, '$1-$2')

    return phoneValue.substring(0, 15)
}