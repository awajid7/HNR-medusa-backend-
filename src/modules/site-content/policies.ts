/**
 * Default text of the store's policy pages and size guide, edited in the admin
 * under "Site content". Keep this file free of imports: the admin page uses it.
 * The storefront keeps an identical copy (src/lib/data/policies.ts).
 *
 * Format: a line starting "## " is a heading, "- " is a bullet, and lines that
 * start with "|" form a table whose first row is the header. A blank line
 * starts a new paragraph. {whatsapp}, {email} and {address} are replaced with
 * the contact details from the "Contact details and footer" section.
 */

export const POLICY_FORMAT_HELP =
  'Start a line with "## " for a heading or "- " for a bullet. Lines starting with | make a table, the first one being the header. Leave a blank line between paragraphs. {whatsapp}, {email} and {address} show your contact details.'

export const SHIPPING_POLICY = `Every H&R by Raza piece is made to order at our Gulberg studio in Lahore, so delivery time is making time plus courier time.

## Making time
- Every order takes a minimum of 15 and a maximum of 20 days to make, counted from the day we confirm your order (for made-to-measure orders, from the day we receive the advance and your measurements).
- For weddings and events, please order at least 3 to 4 weeks before the date. Message us on WhatsApp at {whatsapp} if you need it sooner and we will tell you honestly whether we can manage.
- We confirm every order on WhatsApp before we start, and message you again when it is dispatched.

## Delivery charges
| Option | Charge | Time after dispatch |
| Standard delivery, all of Pakistan | PKR 300, free on orders of PKR 15,000 or more | 2 to 5 working days |
| Express delivery, Lahore only | PKR 500 | 1 to 2 working days |
| Pick up from our Gulberg studio | Free | We message you when it is ready |

## Couriers and tracking
- We deliver across Pakistan through trusted courier companies. You receive the tracking number on WhatsApp once your parcel is booked.
- Courier times are estimates. Weather, public holidays and strikes can delay deliveries, and we will keep you updated.
- We do not ship outside Pakistan through the website yet. For international orders, message us on WhatsApp.

## Cash on delivery
- Cash on delivery is available across Pakistan for standard-size orders. Please keep the exact amount ready.
- Please check the parcel for damage in front of the rider. If the packaging is opened or damaged, note it with the rider and message us.
- If a cash on delivery order is refused without a valid reason, we may ask for advance payment, including delivery charges, on future orders.

## Studio pickup
Shop 4, Ground Floor, The Monal Plaza, Gulberg III, Liberty Roundabout, Lahore. Monday to Saturday 12 to 10 PM, Sunday 3 to 10 PM. Please bring your order number.`

export const RETURNS_POLICY = `Each piece is cut and finished for you, so our policy is built around getting the fit right rather than sending clothes back and forth.

## Reporting a problem
- Please check your order as soon as it arrives. Any issue must be reported within 7 days of delivery, on WhatsApp at {whatsapp} or by email at {email}.
- Send your order number and clear photos of the issue. Pieces must be unworn, unwashed and with their tags, except for the fitting check.
- Issues reported after 7 days cannot be accepted.

## Standard sizes (S to XL)
- If a piece arrives faulty, damaged or different from what you ordered, we will repair, remake or replace it free of charge, including delivery both ways.
- If the size does not fit, we will alter it or exchange it for another size once. You pay the delivery charges for the exchange.
- We do not offer refunds for a change of mind. If an exchange is not possible, we will issue store credit.

## Made to measure and bespoke orders
- Made-to-measure and bespoke pieces cannot be returned or exchanged, because they are made for one person.
- If the fit is not right, we will alter the piece free of charge within 7 days of delivery. You can visit our Gulberg studio or send the piece back to us.
- If the piece does not match the measurements you gave us, or has a stitching or fabric fault, we will fix or remake it at no cost.
- Small differences in colour, hand embroidery and handwork from the photos are part of handmade work and are not faults.

## Cancellations
- You can cancel a standard-size order free of charge before it is dispatched.
- You can cancel a made-to-measure or bespoke order within 24 hours of paying the advance, and we refund it in full. After that the fabric has been cut for you, and the advance cannot be refunded.

## Refunds
- When a refund is agreed, we send it within 7 to 10 working days of receiving and checking the piece.
- Refunds go to your bank account, JazzCash or Easypaisa wallet. Delivery charges are not refunded unless the mistake was ours.`

export const TERMS = `These terms apply to every order placed with H&R by Raza at hnrbyraza.com, on WhatsApp or at our Gulberg studio. By placing an order you accept them.

## About us
H&R by Raza (est. 2010 as Hesham & Raza) is a men's and boys' eastern wear label based at {address}. You can reach us on WhatsApp at {whatsapp} or by email at {email}.

## Orders
- Your order is confirmed once we message you on WhatsApp to confirm it. We may decline an order, for example if a fabric is no longer available, and we will refund anything you have paid.
- Every piece is made to order. Making takes 15 to 20 days, as explained in our Shipping and delivery policy.
- For made-to-measure pieces, you are responsible for giving us correct measurements. We are happy to take them at our studio or guide you on WhatsApp.

## Prices and payment
- Prices are in Pakistani Rupees and include taxes. Delivery charges are shown at checkout.
- Standard-size orders can be paid by cash on delivery, bank transfer, JazzCash or Easypaisa.
- Made-to-measure and bespoke orders need a 50% advance before we start. The balance is due before dispatch or at pickup.
- If a price on the website is wrong because of an obvious error, we will contact you before making your order.

## Product photos
We try to show every piece accurately. Screens show colours differently, and handwork and embroidery vary slightly from piece to piece, so small differences from the photos are expected.

## Returns and cancellations
Returns, exchanges, alterations, cancellations and refunds are covered by our Returns and exchanges policy.

## Our responsibility
We are responsible for making your piece as ordered and delivering it to the address you give us. We are not responsible for delays caused by couriers, weather or events outside our control, but we will always help you resolve them.

## Your information
We use your details only to make and deliver your order, as explained in our Privacy policy.

## Law
These terms are governed by the laws of Pakistan, and any dispute will be handled by the courts of Lahore. We may update these terms, and the version on this page when you order applies to your order.`

export const PRIVACY_POLICY = `This policy explains what information H&R by Raza collects when you shop with us, and how we use it.

## What we collect
- Your name, phone number, email address and delivery address when you place an order.
- Your body measurements, if you order a made-to-measure piece.
- Your order history and messages you send us on WhatsApp or by email.
- Basic technical information such as your browser and pages visited, and small cookies that keep your bag and checkout working.

We do not collect or store card numbers on our website.

## How we use it
- To make, confirm and deliver your order, and to contact you about it.
- To keep your measurements so you can reorder without being measured again.
- To send you news or offers, only if you agree. You can ask us to stop at any time.
- To keep our records as required by law.

## Who we share it with
We share only what is needed with:
- Courier companies, to deliver your order.
- Banks and payment services such as JazzCash and Easypaisa, when you pay through them.
- The services that run our website and send order emails.
- Government authorities, if the law requires it.

We never sell your information.

## Advertising
If we advertise on Facebook, Instagram or Google, those companies may use cookies to measure visits from their ads. You can control this in your browser and in your account settings with them.

## How long we keep it
We keep order records for as long as the law requires, and your measurements until you ask us to delete them.

## Your choices
You can ask us to show, correct or delete your information at any time by messaging us on WhatsApp at {whatsapp} or emailing {email}.

## Contact
H&R by Raza, {address}.`

export const SIZE_GUIDE = `Our pieces come in standard sizes S to XL, or made to measure. If you are between sizes, choose Made to measure or message us on WhatsApp at {whatsapp} and we will help you pick.

All measurements are in inches and are of the garment, not the body. Chest, waist and hips are measured flat across the front, from side seam to side seam, so double them for the full measurement.

## Kurta
| Size | Chest | Waist | Hips | Shoulder | Sleeve | Length |
| S | 20 | 19.5 | 21 | 17.5 | 23.5 | 39 |
| M | 21 | 20.5 | 22 | 18.5 | 24.5 | 40 |
| L | 22 | 21.5 | 23 | 19 | 25 | 41 |

## Kurta set
These are body measurements, all the way round.
| Size | Chest | Waist | Hips | Shoulder | Sleeve | Kurta length |
| S/M | 34 to 36 | 32 to 34 | 34 to 36 | 17 | 24 | 39 |
| M | 36 to 38 | 34 to 36 | 38 to 40 | 18 | 25 | 40 |
| L | 38 to 40 | 36 to 38 | 40 to 42 | 19 | 26 | 41 |
| L/XL | 42 to 44 | 38 to 42 | 42 to 44 | 19.5 | 27 | 43 |

## Waistcoat
| Size | Chest | Collar | Shoulder | Length |
| S | 20 | 15 | 16 | 27 |
| M | 21 | 16 | 17 | 28 |
| L | 22 | 17 | 18 | 29 |
| XL | 23 | 17.5 | 18.5 | 30 |

## Prince coat
| Size | Chest | Collar | Shoulder | Length |
| S | 20 | 15 | 17.5 | 27.5 |
| M | 21.5 | 16 | 18.5 | 28.5 |
| L | 22.5 | 16.5 | 19 | 29 |

## Boys' waistcoat
| Age | Chest | Shoulder | Length |
| 1 to 2 years | 11.5 | 8.5 | 12.5 |
| 2 years | 11.5 | 9 | 14 |
| 3 years | 12 | 9.5 | 15 |
| 4 years | 13 | 9.5 | 17 |
| 5 to 6 years | 14 | 10 | 18 |
| 7 to 8 years | 14.5 | 10 | 19.5 |
| 9 to 10 years | 15.5 | 12 | 21.5 |

## Sherwani
Every sherwani is made to measure. Visit our Gulberg studio for a fitting, or send us your measurements on WhatsApp.

## How to measure yourself
These are the measurements we take at our studio for every made-to-measure order. Wear a thin shirt, stand straight and keep the tape snug but not tight. It is easier with someone to help.
- Length: from the shoulder joint, beside the neck, down to where you want the hem.
- Chest: around the fullest part of your chest, under the arms.
- Abdominal: around your stomach, at the navel.
- Tummy: around the widest part of your stomach.
- Hips: around the widest part of your hips.
- Shoulders: across your back, from one shoulder bone to the other.
- Sleeves: from the shoulder bone down to the length you want. We recommend 1.3 inches below the wrist bone. Measure the left and right arm.
- Half back: down your back, from the base of the neck to the waist.
- Cross back: across your back, from one armpit seam to the other.
- Collar: around the base of your neck, with one finger under the tape.
- Shalwar length: from the waist down to where you want it to end at your feet.

For made-to-measure orders, send us these measurements on WhatsApp with your height and weight, or visit our Gulberg studio and we will take them for you.`
