export const validate = (schema) => {
  return (req, res, next) => {
    // abortEarly: false ensures Joi returns ALL errors (e.g., both title missing AND date invalid) 
    // rather than stopping at the first error it finds.
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      // Format the errors into a clean array of strings for the React frontend
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({ 
        success: false, 
        message: "Validation Error", 
        errors 
      });
    }
    
    next(); // If validation passes, move to the controller!
  };
};