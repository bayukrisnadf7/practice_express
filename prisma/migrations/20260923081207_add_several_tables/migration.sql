-- AlterTable
ALTER TABLE "data_user" ALTER COLUMN "role" SET DEFAULT 'users',
ALTER COLUMN "updated_at" DROP DEFAULT;

-- CreateTable
CREATE TABLE "data_vehicles" (
    "id" TEXT NOT NULL,
    "plate_number" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "data_vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_routes" (
    "id" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "data_routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_schedule" (
    "id" TEXT NOT NULL,
    "route_id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "departure_at" TIMESTAMP(3) NOT NULL,
    "arrival_at" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "data_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_booking" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "schedule_id" TEXT NOT NULL,
    "seat_number" INTEGER NOT NULL,
    "booking_status" TEXT NOT NULL DEFAULT 'booked',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "data_booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_payment" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "payment_method" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "data_payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "data_schedule" ADD CONSTRAINT "data_schedule_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "data_routes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_schedule" ADD CONSTRAINT "data_schedule_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "data_vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_booking" ADD CONSTRAINT "data_booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "data_user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_booking" ADD CONSTRAINT "data_booking_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "data_schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_payment" ADD CONSTRAINT "data_payment_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "data_booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
