BEGIN;

TRUNCATE
prefcard_cards,
prefcard_users;

INSERT INTO prefcard_users
    (user_name, full_name, position, password)
VALUES
    ('asoohoo', 'Alyssa Soohoo', 'doctor', '$2a$10$XHXxN1BZXgMsVM2oaQNPyuazwBDh4bikyXTAZjAAmlscREwhWPYCy'),
    ('bmoney', 'Bern Money', 'doctor', '$2a$10$JEjD5277Z/rlfvunTxaLXuL6CmoJOHuGaaHLQ9Jdo9SNxQUueWeXC'),
    ('mmilli', 'Metch Milli', 'tech', '$2a$10$V9syYw1dc5tfkQUHyvc9C.Q3WDV.Y0B686owNebxLUXAe5zyvKIp6'),
    ('pgary', 'Patrick Gary', 'nurse', '$2a$10$8v33x1QkPo3KNf6jIknnve5YSP7b.DNETmpHStjGG4YI9uZgvFu5a');
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
    medications,
    access
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
        'Bupivacaine',
        'Kate Nurr'
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
        'Control syringe',
        'Kate Nurr'
    );
COMMIT;