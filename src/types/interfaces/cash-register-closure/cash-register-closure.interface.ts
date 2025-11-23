export interface CashRegisterClosure {
    id: string
    startDate?:  Date
    endDate?:    Date
    cashBalance?: number
    calculateTotal?: number
    realTotal?: number
    status:  string
    difference?: number
    initialCash: number 
    userId: string
    cashRegisterId: string
}