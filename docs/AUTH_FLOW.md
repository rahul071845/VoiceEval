# Authentication Flow

## Register
- Validate Input
- Check Existing User
- Hash Password
- Save User
- Generate JWT
- Return User

## Login
- Validate Input
- Verify Email
- Verify Password
- Generate JWT
- Return User

## Protected Route
- Read JWT
- Verify JWT
- Attach User To Request
- Continue Request