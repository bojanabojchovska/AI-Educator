CREATE TABLE comments (
                          id SERIAL PRIMARY KEY,
                          comment_body TEXT NOT NULL,
                          student_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
                          course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE,
                          date DATE
);

CREATE TABLE ratings (
                         id SERIAL PRIMARY KEY,
                         rating_value INT CHECK (rating_value >= 1 AND rating_value <= 5),
                         student_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
                         course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE,
                         date DATE
);