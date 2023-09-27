module.exports = mongoose => {
  const Question = mongoose.model(
    "question",
    mongoose.Schema(
      {
        questionId: {
          type: String,
          required: true,
          unique: true
        },
        questionTitle: {
          type: String,
          required: true
        },
        questionDescription: {
          type: String,
          required: true
        },
        questionCategory: {
          type: [String],
          required: true
        },
        questionComplexity: {
          type: String,
          required: true
        }
      },
      { timestamps: true }
    )
  );

  return Question;
};