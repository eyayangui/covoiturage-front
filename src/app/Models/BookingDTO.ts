export interface BookingDTO {
    idReservation : number;
    location : string;
    dateBooking : Date;
    userId : number;
    driverId : number;
    announcementId : number;
    bookingStatus : string ;
}