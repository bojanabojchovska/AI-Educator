ALTER TABLE flashcards
DROP CONSTRAINT IF EXISTS fkl0pf9eo3w314s6yw3ev92qrti;

ALTER TABLE flashcards
    ADD CONSTRAINT fk_flashcards_attachment
        FOREIGN KEY (attachment_id)
            REFERENCES user_course_attachments(id)
            ON DELETE CASCADE;