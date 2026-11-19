## devTinder APIs

# auth APIs
- POST /login
- POST /logout
- POST /signup

# profile APIs
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

# connection Request APIs
- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

# user APIs
- GET /user/requests/received
- GET /user/connections
- GET /user/feed