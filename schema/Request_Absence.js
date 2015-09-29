'use strict';

/**
 * Absence request
 * contain a distribution of quantity in multiple rights (Absence Element)
 * 
 * @exemple 
 * distribution: [
 * 		{ quantity: Number, events: [{ dtstart: start_date, dtend: date }]	, right: { quantity_unit: D, ... } }
 * 		{ quantity: Number, events: [{ dtstart: date, dtend: date }]		, right: { quantity_unit: D, ... } }
 * 		{ quantity: Number, events: [{ dtstart: date, dtend: end_date }]	, right: { quantity_unit: H, ... } }
 * ]
 * 
 * 
 * Moved to Request.js
 * 
 */
