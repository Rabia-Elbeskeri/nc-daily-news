\echo "Topics Table"
SELECT * FROM topics;

\echo "Users Table"
SELECT * FROM users;

\echo "Articles Table for Topic 'coding'"
SELECT * FROM articles WHERE topic = 'coding';

\echo "Comments Table where votes are negative"
SELECT * FROM comments WHERE votes < 0;

\echo "Articles Table by User 'grumpy19'"
SELECT * FROM articles WHERE author = 'grumpy19';

\echo "Comments Table where votes are more than 10"
SELECT * FROM comments WHERE votes > 10;
