# 🏛️ ZaneZion Institutional — The Master Flow Document (v2.6)

> **ZaneZion Platinum Network** ek ultra-luxury ecosystem management system hai.  
> Is document mein onboarding se lekar final audit tak ka **Start-to-End** flow documented hai.

---

## � PHASE 1: SaaS Onboarding & Protocol Initialization
**Nayi company platform join karti hai.**

1.  **Request Access**: Nayi company `Plans` page pe jaati hai aur subscription request bhejti hai.
2.  **Super Admin Audit**: Admin `SaaS Management` mein request check karta hai.
3.  **Activation**: Admin approve karta hai → Client account automatically `Clients` table mein add ho jata hai.
4.  **Branding Setup**: Company apna logo aur details upload karti hai (Black version of logo is institutional standard).

---

## 🛒 PHASE 2: Client Command & Ordering
**Client apne portal se items/services order karta hai.**

1.  **Marketplace Catalog**: Client catalog se direct items select karke browse karta hai.
2.  **Custom Manifest**: Agar item catalog mein nahi hai, toh client custom manifest likhkar order place karta hai.
3.  **Checkout & Logic**:
    - Checkout pe Order ID generate hoti hai.
    - System check karta hai: `Manual Invoicing Protocol`. Invoice tabhi generate hogi jab Admin approve karega.
4.  **Mission Creation**: Order automatically `Operations Dashboard` par as a "Mission" appear hoti hai.

---

## ⚙️ PHASE 3: Operations — Mission Fulfillment
**Ops team order ko reality mein convert karti hai.**

1.  **Review Order**: Operations manager naye orders ko review karta hai.
2.  **Vendor Assignment**: Order ke har item ke liye best vendor select kiya jata hai.
3.  **Convert to Project**: Admin order ko high-level `Project` mein convert karta hai (Flowchart match).
4.  **Purchase Request (PR)**: Agar item stock mein nahi hai, toh automatic PR generate hota hai procurement team ke liye.

---

## 📦 PHASE 4: Procurement & Inventory Integrity
**Sahi saaman, sahi waqt pe warehouse pahunchna.**

1.  **Stock Inbound (Entry)**: Vendor se saaman aane par `Stock Entry` hoti hai (Unit Price aur Warehouse Location ke saath).
2.  **Threshold Protection**: Agar kisi item ka stock < 10 units niche jata hai, system **Auto-PR** trigger karta hai.
3.  **Mission Fulfillment**: Auditor inventory se saaman "Issue" karta hai:
    - Qty automatically deduct hoti hai.
    - `Issued To` field mein recipient ka naam/signature save hota hai.
4.  **Audits**: `Inventory Audits` tab se periodically pure warehouse ki checking hoti hai discrepancy dhundne ke liye.

---

## 🚚 PHASE 5: Logistics & Fleet Telemetry
**Assets ko client tak secure pahunchna.**

1.  **Fleet Diagnostics**: Dispatch se pehle vehicle ka insurance aur registration check hota hai.
2.  **Multi-modal Dispatch**: Administrator delivery create karta hai (Road, Sea, ya Air mode).
3.  **Route Selection**: Driver/Chauffeur assign kiya jata hai.
4.  **Live Telemetry**: Admin dashboard par dekhta hai vehicle `On Mission` hai ya `Available`.

---

## 📱 PHASE 6: Staff Terminal & Mission Execution
**Field staff ka kaam.**

1.  **Clock-In**: Staff terminal login karke shift start karta hai (Timer starts).
2.  **Availability Toggle**: Field staff apna status `Online` karta hai → Admin ko Dashboard par map/telemetry dikhti hai.
3.  **Task Acceptance**: Staff task accept karta hai aur step-by-step update deta hai:
    - *Accepted → In Progress → En Route → Complete.*
4.  **Proof of Delivery (POD)**: Photo upload aur signature capture hota hai.

---

## 💼 PHASE 7: HR Protocols & Executive Payroll
**Team aur financials ka khayal.**

1.  **Leave Management**: Staff leave request bhejta hai. System tenure-based vacation days automatically calculate karta hai.
2.  **Institutional Payroll**: Mahine ke end mein Admin payroll calculate karta hai:
    - Base Salary + Bonus.
    - Deductions: NIB (Mandatory), Medical & Pension (Optional Toggles).
3.  **Invoicing**: Admin orders table se manually invoice generate karke client ko bhejta hai.

---

## 📉 PHASE 8: Intelligence & Loss Audit
**Transparency aur real data.**

1.  **Financial Intelligence**: Revenue graphs aur pie charts se business health check hoti hai.
2.  **Loss Tracking Protocol**: 
    - **Shrinkage**: Spoilage ya damage se hone wala nuksaan report mein auto-accumulate hota hai.
    - **Fleet Degradation**: Repair cost aur maintenance costs loss mein reflect hote hain.

---

## � ROLE-BASED ACCESS (The Guardrails)

| Kaun | Kya kar sakta hai? |
|---|---|
| **Super Admin** | Universe access (Settings, SaaS, Payroll, Support). |
| **Inventory Manager** | Stock Entry/Issue, Audits, Warehouse logs. |
| **Client** | Order placement, Invoice payment, Inventory view (only their items). |
| **Field Staff** | Task updates, Shift start/end, Availability mapping. |

---

## �️ KEY TECHNICAL MAPPING (Files)

- **State Brain**: `/src/context/GlobalDataContext.jsx`
- **Security Guard**: `/src/App.jsx` (Role protection)
- **Financial Module**: `/src/pages/Payroll.jsx` & `/src/pages/Invoices.jsx`
- **Asset Control**: `/src/pages/Inventory.jsx` & `/src/pages/Fleet.jsx`
- **Staff Operations**: `/src/pages/EmployeePortal.jsx` & `/src/pages/Users.jsx`

---
*ZaneZion Institutional v2.6 — Zero-Gaps Business Protocol*  
*Flow verified: March 7, 2026*
