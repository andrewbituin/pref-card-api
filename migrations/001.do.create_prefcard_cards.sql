CREATE TABLE IF NOT EXISTS prefcard_cards(
    id SERIAL PRIMARY KEY,
    surgeon TEXT NOT NULL,
    procedure TEXT NOT NULL,
    position TEXT NOT NULL,
    glove_size INTEGER NOT NULL,
    glove_type TEXT NOT NULL,
    dominant_hand TEXT NOT NULL,
    equipment TEXT NOT NULL,
    supplies TEXT NOT NULL,
    instrumentation TEXT NOT NULL,
    suture_and_usage TEXT NOT NULL,
    dressings TEXT NOT NULL,
    skin_prep TEXT NOT NULL,
    medications TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL
)