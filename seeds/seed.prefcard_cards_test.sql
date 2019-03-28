BEGIN;

TRUNCATE
prefcard_cards,
prefcard_users;

INSERT INTO prefcard_users
    (user_name, full_name, position, password)
VALUES
    ('jon', 'Jon Snow', 'doctor', '$2a$12$aT2R/8kL7zlN8udgYq6I9O8EG/CszGa4oA9I0qsXYoIf3x6PQ4znC'),
    ('sansa', 'Sansa Stark', 'doctor', '$2a$12$aT2R/8kL7zlN8udgYq6I9O8EG/CszGa4oA9I0qsXYoIf3x6PQ4znC'),
    ('arya', 'Arya Stark', 'doctor', '$2a$12$aT2R/8kL7zlN8udgYq6I9O8EG/CszGa4oA9I0qsXYoIf3x6PQ4znC'),
    ('rob', 'Rob Stark', 'doctor', '$2a$12$aT2R/8kL7zlN8udgYq6I9O8EG/CszGa4oA9I0qsXYoIf3x6PQ4znC');
INSERT INTO prefcard_cards
    (
    user_id,
    surgeon ,
    procedure ,
    position ,
    glove_size ,
    glove_type ,
    dominant_hand ,
    equipment ,
    supplies ,
    instrumentation ,
    suture_and_usage ,
    dressings ,
    skin_prep ,
    medications
    )
VALUES
    (
        1,
        'Alyssa Soohoo',
        'Appendectomy',
        'Supine',
        7,
        'small',
        'right',
        'Electrosurgical unit with dispersive electrode',
        'Laparotomy pack',
        'Minor instrumentation set',
        'Ties: 2-0 Vicryl Reel',
        'Triple antibiotic ointment',
        'Shave if necessary',
        'Bupivacaine'
    ),
        (
        2,
        'Bern Money',
        'Craniotomy',
        'Supine',
        6.5,
        'small',
        'left',
        'Suction Apparatus',
        'Craniotomy pack',
        'Basic pack',
        'Ties: 2-0 Vicryl Reel',
        'Triple antibiotic ointment',
        'Betadine - 5 min',
        'Control syringe'
    );
COMMIT;