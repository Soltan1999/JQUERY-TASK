$(document).ready(function () {
    var loader = $('.loader');
    $.ajax({
        url: 'https://jsonplaceholder.typicode.com/posts',
        method: 'GET',
        dataType: 'json',
        success: function (posts) {
            posts.sort(function(a, b) {
                return a.id - b.id;
            });

            posts.forEach(function (post, index) {
                $.ajax({
                    url: 'https://jsonplaceholder.typicode.com/comments',
                    method: 'GET',
                    data: { postId: post.id },
                    dataType: 'json',
                    beforeSend: function () {
                        loader.show(); 
                    },
                    success: function (comments) {
                        var firstComment = comments.length > 0 ? comments[0].body : 'Sərh yoxdur';
                        var truncatedComment = firstComment.length > 30 ? firstComment.substring(0, 30) + '...' : firstComment;
                        var truncatedBody = post.body.length > 30 ? post.body.substring(0, 30) + '...' : post.body;

                        var $row = $('<tr><td>' + post.id + '</td><td>' + post.title + '</td><td>' + truncatedBody + '</td><td><span class="ellipsis">' + truncatedComment + '</span></td></tr>');
                        $('#postTable tbody').append($row);

                        $row.find('.ellipsis').on('click', function () {
                            $(this).text(firstComment); 
                        });
                    },
                    complete: function () {
                        loader.hide(); 

                        
                        if (index === posts.length - 1) {
                            sortTable();
                        }
                    },
                    error: function (error) {
                        console.log('Sərhlər sorğusu zamanı xəta baş verdi: ', error);
                    }
                });
            });
        },
        error: function (error) {
            console.log('Posts sorğusu zamanı xəta baş verdi: ', error);
        }
    });

    // Cədvəli sıralamaq üçün funksiya
    function sortTable() {
        var table = $('#postTable');
        var rows = table.find('tbody > tr').get();

        rows.sort(function (a, b) {
            var keyA = $(a).children('td:first').text();
            var keyB = $(b).children('td:first').text();

            return keyA - keyB;
        });

        $.each(rows, function (index, row) {
            table.children('tbody').append(row);
        });
    }
});