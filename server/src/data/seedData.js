/**
 * The dashboard's own built-in demo dataset — no third-party services involved.
 *
 * Seed rows behave like the read-only demo feed always has: their numeric /
 * "ORD-n" ids are display ids that users can override (edit) or hide (delete)
 * in the database without touching this file. Records created in the
 * dashboard live in MongoDB and are returned *before* these rows so a newly
 * added record is always the first one in the table.
 *
 * Money fields are stored as plain numeric strings ("1234.56"); the UI is
 * responsible for formatting them as currency.
 */

export const SEED_CUSTOMERS = [
  { id: 1, name: 'Ava Thompson', email: 'ava.thompson@example.com', company: 'Northwind Labs', phone: '+1 415 555 0110', status: 'Active', joined: '2023-02-14', spend: '4210.50' },
  { id: 2, name: 'Liam Carter', email: 'liam.carter@example.com', company: 'BrightPath Media', phone: '+1 212 555 0142', status: 'Active', joined: '2023-03-21', spend: '1890.00' },
  { id: 3, name: 'Sophia Nguyen', email: 'sophia.nguyen@example.com', company: 'Cobalt Systems', phone: '+1 646 555 0178', status: 'Active', joined: '2023-04-05', spend: '7430.25' },
  { id: 4, name: 'Noah Williams', email: 'noah.williams@example.com', company: 'Harborline Co', phone: '+1 312 555 0163', status: 'Inactive', joined: '2023-05-17', spend: '640.00' },
  { id: 5, name: 'Mia Robinson', email: 'mia.robinson@example.com', company: 'Silverleaf Group', phone: '+1 503 555 0195', status: 'Active', joined: '2023-06-30', spend: '3105.75' },
  { id: 6, name: 'Ethan Brooks', email: 'ethan.brooks@example.com', company: 'Summit Ridge LLC', phone: '+1 720 555 0127', status: 'Active', joined: '2023-07-12', spend: '2280.00' },
  { id: 7, name: 'Isabella Rossi', email: 'isabella.rossi@example.com', company: 'Verde Analytics', phone: '+1 917 555 0134', status: 'Active', joined: '2023-08-25', spend: '9125.00' },
  { id: 8, name: 'Mason Reed', email: 'mason.reed@example.com', company: 'Keystone Freight', phone: '+1 408 555 0186', status: 'Inactive', joined: '2023-09-08', spend: '455.25' },
  { id: 9, name: 'Amelia Foster', email: 'amelia.foster@example.com', company: 'Bluepine Studio', phone: '+1 206 555 0151', status: 'Active', joined: '2023-10-19', spend: '5670.00' },
  { id: 10, name: 'Lucas Bennett', email: 'lucas.bennett@example.com', company: 'Ironwood Supply', phone: '+1 617 555 0109', status: 'Active', joined: '2023-11-02', spend: '1490.00' },
  { id: 11, name: 'Charlotte Kim', email: 'charlotte.kim@example.com', company: 'Lumen Health', phone: '+1 213 555 0172', status: 'Active', joined: '2024-01-15', spend: '6890.40' },
  { id: 12, name: 'James Ortega', email: 'james.ortega@example.com', company: 'Redwood Legal', phone: '+1 702 555 0138', status: 'Active', joined: '2024-02-09', spend: '2740.00' },
  { id: 13, name: 'Harper Delgado', email: 'harper.delgado@example.com', company: 'Clearwater Retail', phone: '+1 305 555 0116', status: 'Active', joined: '2024-03-27', spend: '4055.00' },
  { id: 14, name: 'Benjamin Cole', email: 'benjamin.cole@example.com', company: 'Granite Works', phone: '+1 775 555 0193', status: 'Inactive', joined: '2024-04-11', spend: '810.00' },
  { id: 15, name: 'Evelyn Park', email: 'evelyn.park@example.com', company: 'Nova Circuit', phone: '+1 415 555 0164', status: 'Active', joined: '2024-05-23', spend: '8340.75' },
  { id: 16, name: 'Henry Alvarez', email: 'henry.alvarez@example.com', company: 'Willow & Co', phone: '+1 512 555 0129', status: 'Active', joined: '2024-06-14', spend: '1975.00' },
  { id: 17, name: 'Abigail Stone', email: 'abigail.stone@example.com', company: 'Fieldstone Media', phone: '+1 646 555 0187', status: 'Active', joined: '2024-07-30', spend: '3620.00' },
  { id: 18, name: 'Elijah Grant', email: 'elijah.grant@example.com', company: 'Blue Harbor LLC', phone: '+1 857 555 0145', status: 'Active', joined: '2024-08-16', spend: '5210.00' },
  { id: 19, name: 'Ella McKenzie', email: 'ella.mckenzie@example.com', company: 'Pinegate Ventures', phone: '+1 480 555 0171', status: 'Active', joined: '2024-09-03', spend: '2860.50' },
  { id: 20, name: 'Alexander Pierce', email: 'alexander.pierce@example.com', company: 'Cedar Analytics', phone: '+1 971 555 0158', status: 'Inactive', joined: '2024-10-21', spend: '995.00' },
  { id: 21, name: 'Layla Haddad', email: 'layla.haddad@example.com', company: 'Aurora Design', phone: '+1 718 555 0166', status: 'Active', joined: '2024-11-08', spend: '6425.00' },
  { id: 22, name: 'Daniel Osei', email: 'daniel.osei@example.com', company: 'True North Freight', phone: '+1 651 555 0132', status: 'Active', joined: '2025-01-13', spend: '4780.00' },
  { id: 23, name: 'Chloe Martinez', email: 'chloe.martinez@example.com', company: 'Sunrise Foods', phone: '+1 602 555 0199', status: 'Active', joined: '2025-02-25', spend: '3150.25' },
  { id: 24, name: 'Sebastian Wright', email: 'sebastian.wright@example.com', company: 'Atlas Metrics', phone: '+1 918 555 0121', status: 'Inactive', joined: '2025-03-17', spend: '1220.00' },
  { id: 25, name: 'Grace Ibrahim', email: 'grace.ibrahim@example.com', company: 'Nimbus Cloud Co', phone: '+1 202 555 0154', status: 'Active', joined: '2025-04-29', spend: '7730.00' },
  { id: 26, name: 'Jack Sullivan', email: 'jack.sullivan@example.com', company: 'Harborview Group', phone: '+1 401 555 0183', status: 'Active', joined: '2025-06-10', spend: '2405.00' },
  { id: 27, name: 'Zoe Kowalski', email: 'zoe.kowalski@example.com', company: 'Ember Creative', phone: '+1 313 555 0147', status: 'Active', joined: '2025-08-22', spend: '5985.00' },
  { id: 28, name: 'Owen Fischer', email: 'owen.fischer@example.com', company: 'Copperfield Parts', phone: '+1 256 555 0176', status: 'Active', joined: '2025-10-06', spend: '3340.00' },
  { id: 29, name: 'Lily Petrov', email: 'lily.petrov@example.com', company: 'Vantage Point Inc', phone: '+1 646 555 0104', status: 'Active', joined: '2026-01-19', spend: '1680.00' },
  { id: 30, name: 'Ezra Cohen', email: 'ezra.cohen@example.com', company: 'Beacon Hill Tech', phone: '+1 617 555 0192', status: 'Active', joined: '2026-03-30', spend: '9020.00' },
];

export const SEED_ORDERS = [
  { id: 'ORD-1', customer: 'Ava Thompson', date: '2026-01-12', total: '250.00', status: 'Completed' },
  { id: 'ORD-2', customer: 'Liam Carter', date: '2026-01-18', total: '89.99', status: 'Pending' },
  { id: 'ORD-3', customer: 'Sophia Nguyen', date: '2026-01-27', total: '1240.50', status: 'Completed' },
  { id: 'ORD-4', customer: 'Noah Williams', date: '2026-02-03', total: '45.00', status: 'Failed' },
  { id: 'ORD-5', customer: 'Mia Robinson', date: '2026-02-11', total: '675.25', status: 'Completed' },
  { id: 'ORD-6', customer: 'Ethan Brooks', date: '2026-02-19', total: '310.00', status: 'Review' },
  { id: 'ORD-7', customer: 'Isabella Rossi', date: '2026-02-26', total: '2105.75', status: 'Completed' },
  { id: 'ORD-8', customer: 'Mason Reed', date: '2026-03-04', total: '120.00', status: 'Pending' },
  { id: 'ORD-9', customer: 'Amelia Foster', date: '2026-03-15', total: '860.00', status: 'Completed' },
  { id: 'ORD-10', customer: 'Lucas Bennett', date: '2026-03-22', total: '54.75', status: 'Failed' },
  { id: 'ORD-11', customer: 'Charlotte Kim', date: '2026-03-30', total: '1780.00', status: 'Completed' },
  { id: 'ORD-12', customer: 'James Ortega', date: '2026-04-07', total: '425.00', status: 'Pending' },
  { id: 'ORD-13', customer: 'Harper Delgado', date: '2026-04-16', total: '990.25', status: 'Review' },
  { id: 'ORD-14', customer: 'Benjamin Cole', date: '2026-04-24', total: '75.50', status: 'Completed' },
  { id: 'ORD-15', customer: 'Evelyn Park', date: '2026-05-02', total: '3200.00', status: 'Completed' },
  { id: 'ORD-16', customer: 'Henry Alvarez', date: '2026-05-13', total: '199.99', status: 'Pending' },
  { id: 'ORD-17', customer: 'Abigail Stone', date: '2026-05-21', total: '730.00', status: 'Completed' },
  { id: 'ORD-18', customer: 'Elijah Grant', date: '2026-06-01', total: '1460.00', status: 'Review' },
  { id: 'ORD-19', customer: 'Ella McKenzie', date: '2026-06-12', total: '58.00', status: 'Failed' },
  { id: 'ORD-20', customer: 'Alexander Pierce', date: '2026-06-25', total: '415.40', status: 'Completed' },
  { id: 'ORD-21', customer: 'Layla Haddad', date: '2026-07-03', total: '920.00', status: 'Pending' },
  { id: 'ORD-22', customer: 'Daniel Osei', date: '2026-07-14', total: '2610.00', status: 'Completed' },
  { id: 'ORD-23', customer: 'Chloe Martinez', date: '2026-07-28', total: '145.00', status: 'Completed' },
  { id: 'ORD-24', customer: 'Sebastian Wright', date: '2026-08-05', total: '66.65', status: 'Failed' },
  { id: 'ORD-25', customer: 'Grace Ibrahim', date: '2026-08-19', total: '1875.00', status: 'Review' },
  { id: 'ORD-26', customer: 'Jack Sullivan', date: '2026-08-27', total: '340.00', status: 'Pending' },
  { id: 'ORD-27', customer: 'Zoe Kowalski', date: '2026-09-09', total: '1105.50', status: 'Completed' },
  { id: 'ORD-28', customer: 'Owen Fischer', date: '2026-09-17', total: '289.99', status: 'Completed' },
  { id: 'ORD-29', customer: 'Lily Petrov', date: '2026-09-24', total: '540.00', status: 'Pending' },
  { id: 'ORD-30', customer: 'Ezra Cohen', date: '2026-10-01', total: '4300.00', status: 'Completed' },
];
