// =============================================================
// ========================== rooms=====================================

// Validation
// ===name
// => Name is required
// => Name should be a string
// => name should be at least 5 characters
// === description
// => description is required
// => description should be a string
// => description should be at least 200 characters
// === capacity
// => capacity is required
// => capacity adults is required
// === room price
// => room price is required
// => room price should be a string
// === gallery
// => gallery is required
// => gallery minimum length will be 1

// controllers

// === Create a room
//  => Only permitted admins can create a room

// === edit a room
//  => Only permitted admins can edit a room

// === delete a room
//  => Only permitted admins can delete a room

// === manage room ability
//  => Only permitted admins can delete a room

// === get a room
//  => return room by slug
// === get all rooms
//  => return rooms by query

// =============================================================
// ========================== reservation ======================

// Validator
// Start date
// => start date is required
// => start date should be a type of Date
// =>
// End date
// => End date is required
// => End date should be a type of Date
// =>
// Reserved by
// => Reserved by is required
// => Reserved should be a type of Object id
// =>
// email
// => email is required
// => email should be type of email
// =>
// Phone
// => phone is required
// => phone should be type of number
// =>

// controllers

// reserve room
// => only registered user can reserved a room
// => Room can be reservable if it is available
// => send successful message after successfully reserved a room

// change room reservation status
// => should send an email to the user changing the status

// Rate a service
// User can rate service after completing the reservation
