import { Response, Request, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

function validateNoteTitle() {
    return body('title')
        .isLength({ max: 30 }).withMessage('Note title must be at most 30 characters long')
        .matches(/^[\w\s]+$/).withMessage('Note title can only contain letters, numbers, and spaces');
}

function validateNoteContent() {
    return body('content')
        .optional()
        .isLength({ max: 255 }).withMessage('Note content cannot exceed 255 characters')
        .matches(/^[\w\s.,!?]+$/).withMessage('Note content can only contain normal text and punctuation');
}

// Function to validate user creation
function validateNoteInput() {
    return [
        validateNoteTitle(),
        validateNoteContent(),
        handleValidationErrors
        ];
}

function handleValidationErrors(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export {
    validateNoteTitle,
    validateNoteContent,
    validateNoteInput,
    handleValidationErrors
}
