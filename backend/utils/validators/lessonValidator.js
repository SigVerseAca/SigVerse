const Joi = require('joi');

const youtubeUrlSchema = Joi.string()
  .trim()
  .uri({ scheme: ['http', 'https'] })
  .pattern(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i)
  .allow('')
  .messages({
    'string.uri': 'YouTube video URL must be a valid URL',
    'string.pattern.base': 'YouTube video URL must be a valid youtube.com or youtu.be link'
  });

exports.lessonCreateSchema = Joi.object({
  module_id: Joi.number().integer().required(),
  lesson_name: Joi.string().min(2).required(),
  content: Joi.string().optional().allow(''),
  youtube_video_url: youtubeUrlSchema.optional()
});

exports.lessonPatchSchema = Joi.object({
  module_id: Joi.number().integer().optional(),
  lesson_name: Joi.string().min(2).optional(),
  content: Joi.string().optional().allow(''),
  youtube_video_url: youtubeUrlSchema.optional()
}).min(1);
