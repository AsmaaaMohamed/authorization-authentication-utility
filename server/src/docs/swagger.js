/**
 * File: src/docs/swagger.js
 * Description: OpenAPI 3.0 specification definitions and Swagger UI dashboard initializer for the Express backend.
 *
 * Steps:
 * 1. Defines OpenAPI 3.0 metadata, local/production servers, and API tags.
 * 2. Configures security schemes for HTTP Bearer JWT and HTTP-only cookie tokens.
 * 3. Defines reusable component schemas for Users, Images, Authentication DTOs,
 *    Workspaces, Workspace requests, and common responses.
 * 4. Documents Authentication, User Profile, Image & Cloudinary,
 *    and Workspace REST API endpoints.
 * 5. Documents workspace ownership, duplicate-name validation,
 *    update, retrieval, and deletion behavior.
 * 6. Provides setupSwagger function to serve interactive Swagger UI
 *    at /api-docs and raw JSON spec at /api-docs.json.
 */

import swaggerUi from 'swagger-ui-express';

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Auth & Authorization Utility API',
    version: '1.0.0',
    description:
      'Comprehensive REST API documentation for Authentication, Role-Based Authorization, Cloudinary Image Management, and OTP Password Reset flows.',
    contact: {
      name: 'Development Team',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server',
    },
  ],
  tags: [
    {
      name: 'Authentication',
      description:
        'User registration, login, logout, email verification & password reset flows',
    },
    {
      name: 'User Profile',
      description: 'Authenticated user profile and account operations',
    },
    {
      name: 'Image & Cloudinary',
      description:
        'Multer in-memory uploads, transformation presets, face-crop avatars, and asset management',
    },
    {
      name: 'Workspace',
      description:
        'Create, retrieve, update, and delete workspaces owned by the authenticated user',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT access token (e.g. Bearer <token>)',
      },
      CookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'token',
        description: 'HTTP-only JWT cookie named "token"',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: {
            type: 'string',
            example: 'Invalid credentials or request error.',
          },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: {
            type: 'string',
            example: 'Operation completed successfully.',
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '665a12b3c4d5e6f7a8b9c0d1' },
          name: { type: 'string', example: 'John Doe' },
          email: {
            type: 'string',
            format: 'email',
            example: 'john@example.com',
          },
          role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
          isVerified: { type: 'boolean', example: true },
          avatar: {
            type: 'object',
            properties: {
              public_id: {
                type: 'string',
                example: 'auth-utility/avatars/avatar_123',
              },
              secure_url: {
                type: 'string',
                example:
                  'https://res.cloudinary.com/demo/image/upload/avatar.jpg',
              },
            },
          },
        },
      },
      Image: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '665a12b3c4d5e6f7a8b9c0d1' },
          public_id: {
            type: 'string',
            example: 'auth-utility/general/img_171928',
          },
          secure_url: {
            type: 'string',
            example:
              'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg',
          },
          format: { type: 'string', example: 'webp' },
          width: { type: 'number', example: 600 },
          height: { type: 'number', example: 600 },
          bytes: { type: 'number', example: 45210 },
          preset: { type: 'string', example: 'medium' },
          responsiveVariants: {
            type: 'object',
            properties: {
              thumbnail: {
                type: 'string',
                example:
                  'https://res.cloudinary.com/demo/image/upload/c_thumb,w_150,h_150/sample.jpg',
              },
              medium: {
                type: 'string',
                example:
                  'https://res.cloudinary.com/demo/image/upload/c_limit,w_600,h_600/sample.jpg',
              },
              fullSize: {
                type: 'string',
                example:
                  'https://res.cloudinary.com/demo/image/upload/sample.jpg',
              },
              roundedAvatar: {
                type: 'string',
                example:
                  'https://res.cloudinary.com/demo/image/upload/r_max,c_fill,g_face,w_300,h_300/sample.jpg',
              },
              grayscale: {
                type: 'string',
                example:
                  'https://res.cloudinary.com/demo/image/upload/e_grayscale/sample.jpg',
              },
            },
          },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'John Doe' },
          email: {
            type: 'string',
            format: 'email',
            example: 'john@example.com',
          },
          password: {
            type: 'string',
            format: 'password',
            minLength: 6,
            example: 'StrongPassword123!',
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'john@example.com',
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'StrongPassword123!',
          },
        },
      },
      SendOtpRequest: {
        type: 'object',
        required: ['email'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'john@example.com',
          },
        },
      },
      VerifyEmailRequest: {
        type: 'object',
        required: ['email', 'otp'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'john@example.com',
          },
          otp: { type: 'string', example: '123456' },
        },
      },
      ResetPasswordRequest: {
        type: 'object',
        required: ['email', 'otp', 'newPassword'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'john@example.com',
          },
          otp: { type: 'string', example: '123456' },
          newPassword: {
            type: 'string',
            format: 'password',
            minLength: 6,
            example: 'NewStrongPassword123!',
          },
        },
      },

      Workspace: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '665a12b3c4d5e6f7a8b9c0d1',
          },
          name: {
            type: 'string',
            example: 'My Workspace',
          },
          description: {
            type: 'string',
            example: 'My personal development workspace',
          },
          iconUrl: {
            type: 'string',
            example: 'https://example.com/icons/workspace.png',
          },
          ownerId: {
            type: 'string',
            example: '665a12b3c4d5e6f7a8b9c0d1',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-08-28T12:00:00.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-08-28T12:30:00.000Z',
          },
        },
      },

      CreateWorkspaceRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            example: 'My Workspace',
            description:
              'Workspace name. Must be unique for the authenticated user.',
          },
          description: {
            type: 'string',
            example: 'My personal development workspace',
          },
          iconUrl: {
            type: 'string',
            example: 'https://example.com/icons/workspace.png',
          },
        },
      },

      UpdateWorkspaceRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            example: 'Updated Workspace',
            description:
              'New workspace name. Must be unique for the authenticated user.',
          },
          description: {
            type: 'string',
            example: 'Updated workspace description',
          },
          iconUrl: {
            type: 'string',
            example: 'https://example.com/icons/new-workspace.png',
          },
        },
      },
    },
  },
  paths: {
    '/api/workspaces': {
      post: {
        tags: ['Workspace'],
        summary: 'Create a new workspace',
        description:
          'Creates a workspace owned by the authenticated user. Workspace names must be unique for the same user.',
        security: [{ BearerAuth: [] }, { CookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateWorkspaceRequest',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Workspace created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    data: {
                      $ref: '#/components/schemas/Workspace',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          409: {
            description:
              'A workspace with the same name already exists for this user',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },

      get: {
        tags: ['Workspace'],
        summary: 'Get all workspaces owned by the authenticated user',
        description:
          'Returns all workspaces belonging to the currently authenticated user, sorted by creation date.',
        security: [{ BearerAuth: [] }, { CookieAuth: [] }],
        responses: {
          200: {
            description: 'Workspaces retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    results: {
                      type: 'integer',
                      example: 3,
                    },
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Workspace',
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },

    '/api/workspaces/{id}': {
      patch: {
        tags: ['Workspace'],
        summary: 'Update a workspace',
        description:
          'Updates a workspace owned by the authenticated user. The workspace name must remain unique for that user.',
        security: [{ BearerAuth: [] }, { CookieAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Workspace ID',
            schema: {
              type: 'string',
            },
            example: '665a12b3c4d5e6f7a8b9c0d1',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateWorkspaceRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Workspace updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    data: {
                      $ref: '#/components/schemas/Workspace',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation error or invalid workspace ID',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          404: {
            description:
              'Workspace not found or the authenticated user is not the owner',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          409: {
            description:
              'A workspace with the same name already exists for this user',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },

      delete: {
        tags: ['Workspace'],
        summary: 'Delete a workspace',
        description: 'Deletes a workspace owned by the authenticated user.',
        security: [{ BearerAuth: [] }, { CookieAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Workspace ID',
            schema: {
              type: 'string',
            },
            example: '665a12b3c4d5e6f7a8b9c0d1',
          },
        ],
        responses: {
          200: {
            description: 'Workspace deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Workspace deleted successfully.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          404: {
            description:
              'Workspace not found or the authenticated user is not the owner',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new user account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: {
                      type: 'string',
                      example:
                        'Registration successful. Please verify your email.',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation error or User already exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Log in with email and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          200: {
            description:
              'Login successful. Sets authentication cookie and returns user profile.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: {
                      type: 'string',
                      example: 'Logged in successfully.',
                    },
                    userData: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Authentication'],
        summary: 'Log out and clear authentication cookies',
        security: [{ BearerAuth: [] }, { CookieAuth: [] }],
        responses: {
          200: {
            description: 'Logged out successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
        },
      },
    },
    '/api/auth/send-verify-otp': {
      post: {
        tags: ['Authentication'],
        summary: 'Send email verification OTP code',
        security: [{ BearerAuth: [] }, { CookieAuth: [] }],
        responses: {
          200: {
            description: 'Verification OTP sent to user email',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
        },
      },
    },
    '/api/auth/verify-email': {
      post: {
        tags: ['Authentication'],
        summary: 'Verify account using 6-digit email OTP',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VerifyEmailRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Account verified successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
          400: {
            description: 'Invalid or expired OTP',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/auth/send-reset-otp': {
      post: {
        tags: ['Authentication'],
        summary: 'Send password recovery OTP to email',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SendOtpRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Password reset OTP sent',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
          400: {
            description: 'User not found or email delivery error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/auth/reset-password': {
      post: {
        tags: ['Authentication'],
        summary: 'Reset password using email, verified OTP, and new password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ResetPasswordRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Password has been reset successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
          400: {
            description: 'Invalid OTP or validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/user/data': {
      get: {
        tags: ['User Profile'],
        summary: 'Get profile details of the authenticated user',
        security: [{ BearerAuth: [] }, { CookieAuth: [] }],
        responses: {
          200: {
            description: 'User profile retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    userData: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/image/upload': {
      post: {
        tags: ['Image & Cloudinary'],
        summary:
          'Upload an image via Multer buffer directly to Cloudinary with presets',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['image'],
                properties: {
                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Image file (JPEG, PNG, WEBP, GIF, max 5MB)',
                  },
                  preset: {
                    type: 'string',
                    enum: [
                      'avatar',
                      'thumbnail',
                      'medium',
                      'banner',
                      'original',
                    ],
                    default: 'original',
                    description: 'Transformation preset to apply during upload',
                  },
                  folder: {
                    type: 'string',
                    default: 'auth-utility',
                    description: 'Cloudinary folder destination',
                  },
                  userId: {
                    type: 'string',
                    description: 'Optional User ID to link the image to',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Image uploaded and processed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: {
                      type: 'string',
                      example: 'Image uploaded and processed successfully.',
                    },
                    data: { $ref: '#/components/schemas/Image' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Invalid file type or file size > 5MB',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/image/avatar': {
      post: {
        tags: ['Image & Cloudinary'],
        summary:
          'Upload or replace user profile avatar with AI face-detection crop',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['image'],
                properties: {
                  image: {
                    type: 'string',
                    format: 'binary',
                    description:
                      'Avatar image file (JPEG, PNG, WEBP, GIF, max 5MB)',
                  },
                  userId: {
                    type: 'string',
                    description: 'User ID for deterministic avatar public_id',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Avatar uploaded and optimized successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: {
                      type: 'string',
                      example: 'Avatar uploaded and optimized successfully.',
                    },
                    data: { $ref: '#/components/schemas/Image' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/image/transform/{publicId}': {
      get: {
        tags: ['Image & Cloudinary'],
        summary:
          'Generate dynamic on-the-fly transformed URLs without physical file creation',
        parameters: [
          {
            name: 'publicId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Cloudinary asset public_id',
            example: 'auth-utility/general/sample_123',
          },
          {
            name: 'width',
            in: 'query',
            schema: { type: 'integer' },
            description: 'Desired width in pixels',
            example: 400,
          },
          {
            name: 'height',
            in: 'query',
            schema: { type: 'integer' },
            description: 'Desired height in pixels',
            example: 400,
          },
          {
            name: 'crop',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['fill', 'thumb', 'limit', 'fit', 'scale'],
            },
            example: 'fill',
          },
          {
            name: 'effect',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['grayscale', 'blur:200', 'sepia'],
            },
            example: 'grayscale',
          },
          {
            name: 'radius',
            in: 'query',
            schema: { type: 'string', enum: ['max', '20', '50'] },
            example: 'max',
          },
        ],
        responses: {
          200: {
            description: 'Dynamic transformation URL generated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    public_id: { type: 'string' },
                    transformedUrl: { type: 'string' },
                    responsiveVariants: { type: 'object' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/image/metadata/{publicId}': {
      get: {
        tags: ['Image & Cloudinary'],
        summary:
          'Get asset details and responsive variants from database and Cloudinary',
        parameters: [
          {
            name: 'publicId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Cloudinary asset public_id',
          },
        ],
        responses: {
          200: {
            description: 'Asset metadata retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Image' },
                    responsiveVariants: { type: 'object' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/image/{publicId}': {
      delete: {
        tags: ['Image & Cloudinary'],
        summary: 'Delete asset from Cloudinary and remove record from MongoDB',
        parameters: [
          {
            name: 'publicId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Cloudinary asset public_id to destroy',
            example: 'auth-utility/general/sample_123',
          },
        ],
        responses: {
          200: {
            description: 'Asset deleted from Cloudinary and database',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: {
                      type: 'string',
                      example:
                        'Asset successfully deleted from Cloudinary and database.',
                    },
                    cloudinaryStatus: { type: 'string', example: 'ok' },
                    databaseRecordDeleted: { type: 'boolean', example: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export const setupSwagger = (app) => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Auth & Cloudinary API Docs',
    }),
  );

  app.use('/docs', (req, res) => res.redirect('/api-docs'));

  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

export default { swaggerSpec, setupSwagger };
