export enum OrderStatusEnum {
    Pending = 'pending',
    Confirmed = 'confirmed',
    OutForDelivery = 'out for delivery',
    Delivered = 'delivered',
    CanceledByUser = 'Canceled By User', // User cancels the order
    CanceledByAdmin = 'Canceled By Admin' ,
    DenyByUser = 'Denyed By User'
}
