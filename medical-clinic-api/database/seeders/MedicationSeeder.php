<?php

namespace Database\Seeders;

use App\Models\Medication;
use Illuminate\Database\Seeder;

class MedicationSeeder extends Seeder
{
    public function run(): void
    {
        $medications = [
            ['name' => 'Paracetamol 500mg', 'category' => 'Pain Relief', 'price' => 5.99, 'cost' => 3.50, 'stock' => 150, 'minStock' => 50, 'sku' => 'MED001', 'supplier' => 'PharmaCorp', 'expiryDate' => '2026-06-15'],
            ['name' => 'Ibuprofen 400mg', 'category' => 'Pain Relief', 'price' => 7.99, 'cost' => 4.50, 'stock' => 120, 'minStock' => 40, 'sku' => 'MED002', 'supplier' => 'MedSupply Inc', 'expiryDate' => '2026-08-20'],
            ['name' => 'Amoxicillin 500mg', 'category' => 'Antibiotics', 'price' => 12.99, 'cost' => 8.00, 'stock' => 15, 'minStock' => 30, 'sku' => 'MED003', 'supplier' => 'PharmaCorp', 'expiryDate' => '2025-12-10'],
            ['name' => 'Omeprazole 20mg', 'category' => 'Digestive', 'price' => 9.99, 'cost' => 5.50, 'stock' => 95, 'minStock' => 35, 'sku' => 'MED004', 'supplier' => 'HealthMeds', 'expiryDate' => '2026-03-25'],
            ['name' => 'Loratadine 10mg', 'category' => 'Allergy', 'price' => 8.49, 'cost' => 4.00, 'stock' => 110, 'minStock' => 40, 'sku' => 'MED005', 'supplier' => 'MedSupply Inc', 'expiryDate' => '2026-09-30'],
            ['name' => 'Metformin 500mg', 'category' => 'Diabetes', 'price' => 6.99, 'cost' => 3.80, 'stock' => 200, 'minStock' => 60, 'sku' => 'MED006', 'supplier' => 'PharmaCorp', 'expiryDate' => '2026-11-15'],
            ['name' => 'Lisinopril 10mg', 'category' => 'Blood Pressure', 'price' => 11.99, 'cost' => 7.00, 'stock' => 25, 'minStock' => 30, 'sku' => 'MED007', 'supplier' => 'HealthMeds', 'expiryDate' => '2026-04-20'],
            ['name' => 'Atorvastatin 20mg', 'category' => 'Cholesterol', 'price' => 14.99, 'cost' => 9.50, 'stock' => 60, 'minStock' => 25, 'sku' => 'MED008', 'supplier' => 'PharmaCorp', 'expiryDate' => '2026-07-10'],
            ['name' => 'Cetirizine 10mg', 'category' => 'Allergy', 'price' => 6.49, 'cost' => 3.20, 'stock' => 8, 'minStock' => 40, 'sku' => 'MED009', 'supplier' => 'MedSupply Inc', 'expiryDate' => '2026-02-28'],
            ['name' => 'Vitamin D3 1000IU', 'category' => 'Supplements', 'price' => 8.99, 'cost' => 4.50, 'stock' => 180, 'minStock' => 50, 'sku' => 'MED010', 'supplier' => 'HealthMeds', 'expiryDate' => '2027-01-15'],
        ];

        foreach ($medications as $medication) {
            Medication::create($medication);
        }
    }
}
