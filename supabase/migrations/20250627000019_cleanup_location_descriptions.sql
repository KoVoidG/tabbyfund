-- Cleanup Location information from existing descriptions to protect privacy

-- 1. Remove whole lines that start with Location:
UPDATE cases
SET description = regexp_replace(description, '(?m)^.*\bLocation:\s*.*$', '', 'gi')
WHERE description ~* '\bLocation:';

-- 2. Remove inline Location: fragments until period or newline
UPDATE cases
SET description = regexp_replace(description, '\s*\bLocation:\s*[^.\n\r]*(?:[.\n\r]|$)', ' ', 'gi')
WHERE description ~* '\bLocation:';

-- 3. Clean up extra blank lines and multiple spaces
UPDATE cases
SET description = trim(regexp_replace(
  regexp_replace(description, '\n{3,}', E'\n\n', 'g'),
  '[ \t]{2,}', ' ', 'g'
))
WHERE description ~* '\bLocation:';
