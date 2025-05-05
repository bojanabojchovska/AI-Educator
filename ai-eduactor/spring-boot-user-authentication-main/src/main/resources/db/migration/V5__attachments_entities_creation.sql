CREATE TABLE comment_attachments (
                                     id SERIAL PRIMARY KEY,
                                     file_name VARCHAR(255),
                                     file_type VARCHAR(255),
                                     file_url TEXT,
                                     uploaded_at TIMESTAMP,
                                     comment_id BIGINT,
                                     CONSTRAINT fk_comment FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

CREATE TABLE student_course_attachment (
                                   id UUID PRIMARY KEY,
                                   file_name VARCHAR(255),
                                   file_type VARCHAR(255),
                                   file_url TEXT,
                                   uploaded_at TIMESTAMP,
                                   chatbot_conversation TEXT,
                                   user_id BIGINT,
                                   course_id BIGINT,
                                   CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
                                   CONSTRAINT fk_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);
