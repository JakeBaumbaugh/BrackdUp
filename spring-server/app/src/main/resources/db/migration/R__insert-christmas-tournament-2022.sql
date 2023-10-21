-- R__insert-christmas-tournament-2022

DO $$
BEGIN

IF (SELECT id FROM tournament WHERE name = 'Christmas Tournament 2021') IS NULL THEN

    INSERT INTO tournament (id, name, spotify_playlist)
        VALUES (2, '2022 Christmas Tournament', 'https://open.spotify.com/playlist/5foOh9yqbEqD3x6VJjwiBm?si=35d9f4393f424b89');

    -- Songs
    -- Run Rudolph Run - Chuck Berry - 21
    -- Little Drummer Boy - Pentatonix - 32
    -- Baby It's Cold Outside - Menzel & Buble - 27
    INSERT INTO song (id, title, artist, spotify) --65
        VALUES (65, 'Jingle Bell Rock (Jingle Bell Cock)', 'Blowfly', 'https://open.spotify.com/track/653fWPcwNDUH6LAE650GNq?si=687685862f4a4b7e');
    -- Last Christmas - Wham! - 50
    INSERT INTO song (id, title, artist, spotify) --66
        VALUES (66, 'Holly Jolly Christmas', 'Michael Bublé', 'https://open.spotify.com/track/5PuKlCjfEVIXl0ZBp5ZW9g?si=31c86f1ce3754e6d');
    -- Hallelujah - Pentatonix - 16
    -- Step Into Christmas - Elton John - 51
    -- Snoopy's Christmas - The Royal Guardsmen - 13
    INSERT INTO song (id, title, artist, spotify) --67
        VALUES (67, 'The Christmas Waltz', 'Leslie Odom Jr.', 'https://open.spotify.com/track/7J0cerYwEoX1inloapkWBz?si=f7573a46bc0b481a');
    -- All I Want for Christmas is You - Mariah Carey - 33
    -- Let It Snow! Let It Snow! Let it Snow! - Frank Sinatra - 2
    -- Believe - Josh Groban - 7
    INSERT INTO song (id, title, artist, spotify) --68
        VALUES (68, 'Winter Wonderland', 'Oak Ridge Boys', 'https://open.spotify.com/track/6L8Vy39dMS4mRP6IMqs0H5?si=2bece710dacf4792');
    INSERT INTO song (id, title, artist, spotify) --69
        VALUES (69, 'The Very First Christmas', 'Spongebob Squarepants', 'https://open.spotify.com/track/21DN71RhbOvXXS4ntzjzJR?si=af2a7836985b4051');
    -- A Mad Russian's Christmas - Trans-Siberian Orchestra - 62
    INSERT INTO song (id, title, artist, spotify) --70
        VALUES (70, 'Thistlehair the Christmas Bear', 'Alabama', 'https://open.spotify.com/track/0xs5fQ4jGuUZUk0n6tIFjX?si=69984467932e4a01');
    -- That's Christmas to Me - Pentatonix - 61
    -- Jingle Bell Rock - Bobby Helms - 1
    -- Blue Christmas - Elvis Presley - 11
    INSERT INTO song (id, title, artist, spotify) --71
        VALUES (71, 'Christmas Truce', 'Sabaton', 'https://open.spotify.com/track/5FaSqONiGaXC0LwQRSYgJq?si=8d7afecb325f4ac0');
    INSERT INTO song (id, title, artist, spotify) --72
        VALUES (72, 'Hark! The Herald Angels Sing', 'Pentatonix', 'https://open.spotify.com/track/7DG0w4DhCctrvlXIai22yg?si=4eae1b4becfe4dd4');
    -- Wonderful Christmastime - Paul McCartney - 23
    INSERT INTO song (id, title, artist, spotify) --73
        VALUES (73, 'Pokemon Christmas Bash', 'Pokémon', 'https://open.spotify.com/track/28uxONdMWaGJgXUQMVKKcj?si=7035ec654a7143f5');
    INSERT INTO song (id, title, artist, spotify) --74
        VALUES (74, 'Santa Tell Me', 'Ariana Grande', 'https://open.spotify.com/track/0lizgQ7Qw35od7CYaoMBZb?si=6dfba33339114c45');
    INSERT INTO song (id, title, artist, spotify) --75
        VALUES (75, 'A Very Polish Christmas', 'Sabadu', 'https://open.spotify.com/track/73zmZdpj0HBZDlimmZwsrE?si=df956bfd2c6a459b');
    -- Mistletoe - Justin Bieber - 39
    INSERT INTO song (id, title, artist, spotify) --76
        VALUES (76, 'Hot Chocolate', 'Tom Hanks', 'https://open.spotify.com/track/0xG51SjOyHb0JOVcfiOEQw?si=5b2864d277e84ca9');
    -- Little Saint Nick - The Beach Boys - 35
    -- Underneath the Tree - Kelly Clarkson - 47
    INSERT INTO song (id, title, artist, spotify) --77
        VALUES (77, 'A Marshmallow World', 'Darlene Love', 'https://open.spotify.com/track/7GNsHkiYPcQQjvhTiILFUL?si=ed2d81cfc4354a24');
    INSERT INTO song (id, title, artist, spotify) --78
        VALUES (78, 'Silver and Gold', 'Burl Ives', 'https://open.spotify.com/track/5EmYSWE2LpTd4hXxPYdbSf?si=eeaabb2827744d02');
    -- Sleigh Ride - The Ronettes - 57
    INSERT INTO song (id, title, artist, spotify) --79
        VALUES (79, 'Angels We Have Heard on High', 'Pentatonix', 'https://open.spotify.com/track/25r2G9MxFht1NKOGjHsC1r?si=5ff6adad4d2a4655');
    -- Oh Come All Ye Faithful - Twisted Sister - 6
    -- The 12 Days of Christmas - Straight No Chaser - 19
    -- Feliz Navidad - José Feliciano - 55
    -- Santa Claus is Comin' to Town - Bruce Springsteen - 52
    INSERT INTO song (id, title, artist, spotify) --80
        VALUES (80, 'Last Christmas', 'Russkaja', 'https://open.spotify.com/track/4kMKaw5mIY7HXjtKXtPACr?si=1cdd8de5159d4c8f');
    -- Linus and Lucy - Vince Guaraldi Trio - 24
    INSERT INTO song (id, title, artist, spotify) --81
        VALUES (81, 'Wizards in Winter', 'Trans-Siberian Orchestra', 'https://open.spotify.com/track/3dvhNq0P4rNaFqmj21jKF5?si=42d2dbd4904b41b9');
    INSERT INTO song (id, title, artist, spotify) --82
        VALUES (82, 'Do They Know It''s Christmas?', 'Band Aid', 'https://open.spotify.com/track/0247StOpd3AkeBQzANX4Zf?si=0370d74b418247be');
    -- Rockin' Around the Christmas Tree - Brenda Lee - 9
    INSERT INTO song (id, title, artist, spotify) --83
        VALUES (83, 'Mele Kalikimaka (Merry Christmas)', 'Bing Crosby', 'https://open.spotify.com/track/04vLj9QUXoKdRlsp3gkURo?si=3d4f9f81c49d4737');
    -- Christmas (Baby Please Come Home) - Darlene Love - 29
    INSERT INTO song (id, title, artist, spotify) --84
        VALUES (84, 'I Saw Mommy Kissing Santa Claus', 'The Jackson 5', 'https://open.spotify.com/track/15sxLiiChE5dCW3Y756oas?si=717b2554d58d4a6c');
    -- It's the Most Wonderful Time of the Year - Andy Williams - 41
    INSERT INTO song (id, title, artist, spotify) --85
        VALUES (85, 'The First Noel', 'Pentatonix', 'https://open.spotify.com/track/7ruCorRQFMBqYaEhtQxfqp?si=9a168375e1db4d74');
    -- Christmas All Over Again - Tom Petty - 17
    INSERT INTO song (id, title, artist, spotify) --86
        VALUES (86, 'You''re A Mean One, Mr. Grinch', 'Tyler, the Creator', 'https://open.spotify.com/track/5xQskDSiHQeoebxoprn3HL?si=259a85c6e6624ca8');
    -- Deck the Halls - Nat King Cole - 15
    -- Merry Christmas Everyone - Shakin' Stevens - 64
    INSERT INTO song (id, title, artist, spotify) --87
        VALUES (87, 'Carol of the Bells', 'Straight No Chaser', 'https://open.spotify.com/track/3mXq6j7KX2t1EPHin5JqCu?si=47630f00e80a484c');
    INSERT INTO song (id, title, artist, spotify) --88
        VALUES (88, 'Where Are You Christmas?', 'Pentatonix', 'https://open.spotify.com/track/7klqcDdyk3laSiOtxNrygB?si=55b2cd7d709246f4');
    INSERT INTO song (id, title, artist, spotify) --89
        VALUES (89, 'Boughs of Holly', 'Trans-Siberian Orchestra', 'https://open.spotify.com/track/5t08jqyzXhKlBcs78edvsp?si=0ee7acb1250949fa');
    INSERT INTO song (id, title, artist, spotify) --90
        VALUES (90, 'Father Christmas', 'Bad Religion', 'https://open.spotify.com/track/606bXynpjFXW1YLOkWCeeC?si=a73d14bfbc50478b');
    -- What Christmas Means to Me - CeeLo Green - 59
    -- Mary, Did You Know? - Pentatonix - 45
    INSERT INTO song (id, title, artist, spotify) --91
        VALUES (91, 'The Christmas Guest', 'Johnny Cash', 'https://open.spotify.com/track/4YhNy3QoygdrUrVJySU77I?si=1f4c7b6d778f4b8e');
    -- Christmas Wrapping - The Waitresses - 40
    INSERT INTO song (id, title, artist, spotify) --92
        VALUES (92, 'Do You Hear What I Hear', 'Idina Menzel', 'https://open.spotify.com/track/3fhAMD4hz0IgEukGrp5lZb?si=88372c345f754449');
    INSERT INTO song (id, title, artist, spotify) --93
        VALUES (93, 'Have Yourself A Merry Little Christmas', 'Frank Sinatra', 'https://open.spotify.com/track/2FPfeYlrbSBR8PwCU0zaqq?si=2b08d9bf7b0c4b4a');
    INSERT INTO song (id, title, artist, spotify) --94
        VALUES (94, 'Carol of the Bells', 'Mykola Dmytrovych Leontovych, John Williams', 'https://open.spotify.com/track/4tHqQMWSqmL6YjXwsqthDI?si=d1e7051cb0b34ee7');
    INSERT INTO song (id, title, artist, spotify) --95
        VALUES (95, '(There''s No Place Like) Home for the Holidays', 'Perry Como', 'https://open.spotify.com/track/5mKxNjNnRFpO9Muzw3Ug0u?si=b4aa45ad83594ce2');

    -- Tournament levels
    INSERT INTO tournament_level (id, tournament_id, name) --7
        VALUES (7, 2, 'Round 1');
    INSERT INTO tournament_level (id, tournament_id, name) --8
        VALUES (8, 2, 'Round 2');
    INSERT INTO tournament_level (id, tournament_id, name) --9
        VALUES (9, 2, 'Sweet Sixteen');
    INSERT INTO tournament_level (id, tournament_id, name) --10
        VALUES (10, 2, 'Elite Eight');
    INSERT INTO tournament_level (id, tournament_id, name) --11
        VALUES (11, 2, 'Final Four');
    INSERT INTO tournament_level (id, tournament_id, name) --12
        VALUES (12, 2, 'Holly Jolly Bowl');
    
    -- Tournament rounds
    INSERT INTO tournament_round (id, level_id, start_date, end_date) --11
        -- VALUES (11, 7, '2022-11-6 00:00', '2022-11-12 00:00');
        VALUES (11, 7, '2023-09-06 00:00', '2023-09-12 00:00');
    INSERT INTO tournament_round (id, level_id, start_date, end_date) --12
        -- VALUES (12, 7, '2022-11-12 00:00', '2022-11-18 00:00');
        VALUES (12, 7, '2023-09-12 00:00', '2023-09-18 00:00');
    INSERT INTO tournament_round (id, level_id, start_date, end_date) --13
        -- VALUES (13, 7, '2022-11-18 00:00', '2022-11-24 00:00');
        VALUES (13, 7, '2023-09-18 00:00', '2023-09-24 00:00');
    INSERT INTO tournament_round (id, level_id, start_date, end_date, status) --14
        -- VALUES (14, 7, '2022-11-24 00:00', '2022-11-30 00:00');
        VALUES (14, 7, '2023-09-24 00:00', '2023-12-12 00:00', 'ACTIVE');
    INSERT INTO tournament_round (id, level_id, start_date, end_date) --15
        -- VALUES (15, 8, '2022-11-30 00:00', '2022-12-06 00:00');
        VALUES (15, 8, '2023-12-12 00:00', '2023-12-14 00:00');
    INSERT INTO tournament_round (id, level_id, start_date, end_date) --16
        -- VALUES (16, 8, '2022-12-6 00:00', '2022-12-12 00:00');
        VALUES (16, 8, '2023-12-14 00:00', '2023-12-16 00:00');
    INSERT INTO tournament_round (id, level_id, start_date, end_date) --17
        -- VALUES (17, 9, '2022-12-12 00:00', '2022-12-18 00:00');
        VALUES (17, 9, '2022-12-16 00:00', '2022-12-18 00:00');
    INSERT INTO tournament_round (id, level_id, start_date, end_date) --18
        VALUES (18, 10, '2022-12-18 00:00', '2022-12-22 00:00');
    INSERT INTO tournament_round (id, level_id, start_date, end_date) --19
        VALUES (19, 11, '2022-12-22 00:00', '2022-12-24 00:00');
    INSERT INTO tournament_round (id, level_id, start_date, end_date) --20
        VALUES (20, 12, '2022-12-24 00:00', '2022-12-25 00:00');
    
    -- Tournament matches
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (11, 21, 32, 21);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (11, 27, 65, 27);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (11, 50, 66, 50);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (11, 16, 51, 16);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (11, 13, 67, 13);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (11, 33, 2, 2);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (11, 7, 68, 68);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (11, 69, 62, 62);

    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (12, 70, 61, 61);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (12, 1, 11, 1);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (12, 71, 72, 71);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (12, 23, 73, 23);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (12, 74, 75, 75);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (12, 39, 76, 76);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (12, 35, 47, 35);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (12, 77, 78, 78);

    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (13, 57, 79, 57);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (13, 6, 19, 19);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (13, 55, 52, 52);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (13, 80, 24, 80);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (13, 81, 82, 81);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (13, 9, 83, 83);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (13, 29, 84, 29);
    INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
        VALUES (13, 41, 85, 41);

    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (14, 17, 86, 17);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (14, 15, 64, 64);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (14, 87, 88, 87);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (14, 89, 90, 90);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (14, 59, 45, 59);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (14, 91, 40, 40);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (14, 92, 93, 93);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (14, 94, 95, 95);
    INSERT INTO tournament_match (round_id, song_1, song_2)
        VALUES (14, 17, 86);
    INSERT INTO tournament_match (round_id, song_1, song_2)
        VALUES (14, 15, 64);
    INSERT INTO tournament_match (round_id, song_1, song_2)
        VALUES (14, 87, 88);
    INSERT INTO tournament_match (round_id, song_1, song_2)
        VALUES (14, 89, 90);
    INSERT INTO tournament_match (round_id, song_1, song_2)
        VALUES (14, 59, 45);
    INSERT INTO tournament_match (round_id, song_1, song_2)
        VALUES (14, 91, 40);
    INSERT INTO tournament_match (round_id, song_1, song_2)
        VALUES (14, 92, 93);
    INSERT INTO tournament_match (round_id, song_1, song_2)
        VALUES (14, 94, 95);

    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (15, 21, 27, 21);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (15, 50, 16, 50);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (15, 13, 2, 13);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (15, 68, 62, 62);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (15, 61, 1, 1);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (15, 71, 23, 71);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (15, 75, 76, 76);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (15, 35, 78, 35);
    INSERT INTO tournament_match (round_id, song_1, song_2)
        VALUES (15, 21, 27);
    INSERT INTO tournament_match (round_id, song_1, song_2)
        VALUES (15, 50, 16);
    INSERT INTO tournament_match (round_id, song_1, song_2)
        VALUES (15, 13, 2);
    INSERT INTO tournament_match (round_id, song_1, song_2)
        VALUES (15, 68, 62);
    INSERT INTO tournament_match (round_id, song_1, song_2)
        VALUES (15, 61, 1);
    INSERT INTO tournament_match (round_id, song_1, song_2)
        VALUES (15, 71, 23);
    INSERT INTO tournament_match (round_id, song_1, song_2)
        VALUES (15, 75, 76);
    INSERT INTO tournament_match (round_id, song_1, song_2)
        VALUES (15, 35, 78);

    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (16, 57, 19, 57);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (16, 52, 80, 52);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (16, 81, 83, 81);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (16, 29, 41, 41);
    INSERT INTO tournament_match (round_id, song_1, song_2)
        VALUES (16, 57, 19);
    INSERT INTO tournament_match (round_id, song_1, song_2)
        VALUES (16, 52, 80);
    INSERT INTO tournament_match (round_id, song_1, song_2)
        VALUES (16, 81, 83);
    INSERT INTO tournament_match (round_id, song_1, song_2)
        VALUES (16, 29, 41);
    -- BELOW NEEDS UPDATED    
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (6, 50, 51, 50);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (6, 54, 55, 55);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (6, 57, 59, 57);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (6, 61, 64, 61);
    
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (7, 3, 6, 3);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (7, 9, 16, 9);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (7, 17, 21, 17);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (7, 27, 29, 29);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (7, 35, 37, 35);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (7, 41, 45, 41);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (7, 50, 55, 50);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (7, 57, 61, 57);

    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (8, 3, 9, 3);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (8, 17, 29, 17);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (8, 35, 41, 35);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (8, 50, 57, 50);

    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (9, 3, 17, 3);
    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (9, 35, 50, 35);

    -- INSERT INTO tournament_match (round_id, song_1, song_2, song_winner)
    --     VALUES (10, 3, 35, 3);

    PERFORM
        setval('tournament_id_seq', 2),
        setval('tournament_level_id_seq', 12),
        setval('tournament_round_id_seq', 20),
        setval('song_id_seq', 95);

END IF;

END $$;