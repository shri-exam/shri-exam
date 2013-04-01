$().ready(function () {
    var scrollContent = $(".thumb-wrap"),
        slideImage = $(".slide-image");
    $.ajax({
        type:"GET",
        url:"http://api-fotki.yandex.ru/api/users/aig1001/album/63684/photos/?format=json",
        dataType:"jsonp",
        beforeSend:function () {
            $(".loader").show();
        },
        complete:function () {
            $(".loader").hide();
        },
        success:function (data) {
            var img = [];
            for (var i = 0; i < data['entries'].length; i++) {
                var imgSrcSmall = data['entries'][i]['img']['S']['href'],
                    imgSrcBig = data['entries'][i]['img']['L']['href'],
                    imgH = data['entries'][i]['img']['L']['height'];
                imgW = data['entries'][i]['img']['L']['width'];
                o = {'S':imgSrcSmall, 'L':imgSrcBig, 'imgH':imgH, 'imgW':imgW};
                img.push(o);
            }

            for (var i = 0; i < img.length; i++) {
                $(".thumb").append('<li data-width="' + img[i].imgW + '" data-height="' + img[i].imgH + '"><a href="' + img[i].L + '"></a></li>');
                $(".thumb li:last-child").css("background-image", "url(" + img[i].S + ")");

            }
            if (localStorage) {
                if (localStorage.img) {
                    slideImage.prop("src", localStorage.img).css({"margin-top":-slideImage.height() / 2, "margin-left":-slideImage.width() / 2})
                }
                else {
                    slideImage.prop("src", data['entries'][0]['img']['L']['href']).css({"margin-top":-slideImage.height() / 2, "margin-left":-slideImage.width() / 2});
                }
                if (localStorage.thumbActive){
                    $(".thumb li:eq("+localStorage.thumbActive+")").addClass("active");
                }
                else {
                    $(".thumb li:first-child").addClass("active");
                }
            }

            var thumbsWidth = $(".thumb li").outerWidth(true);
            $(".thumb").css("width", thumbsWidth * i + "px");
        }

    })

    $(document).on('click', ".thumb li", function (e) {
        $(this).siblings(".active").removeClass("active");
        $(this).addClass("active");
        slideImage.prop("src", $(this).find("a").prop("href"))
            .css({"margin-top":-$(this).attr("data-height")/2, "margin-left":0})
            .animate({ "margin-left":-$(this).attr("data-width") / 2});
        localStorage.img = slideImage.prop("src");
        localStorage.thumbActive = $(this).index("li");
        return false;

    });

    $(document).mouseover(function () {
        $(".next, .prev").show();
    }).mouseout(function () {
            $(".next, .prev").hide();
    })
    $(".next").click(function () {
        $(".slide-image")
            .prop("src", $(".thumb .active").next().find("a").prop("href"))
            .css({"margin-top":-$(".thumb .active").attr("data-height")/2, "margin-left":0})
            .animate({ "margin-left":-$(".thumb .active").attr("data-width") / 2});

        if (!$(".thumb li:last-child").hasClass("active")) {
            $(".thumb .active").removeClass("active").next().addClass("active");
        }

    });
    $(".prev").click(function () {
        slideImage
            .prop("src", $(".thumb .active").prev().find("a").prop("href"))
            .css({"margin-top":-$(".thumb .active").attr("data-height")/2, "margin-left":0})
            .animate( { "margin-left":-$(".thumb .active").attr("data-width") / 2});

        if (!$(".thumb li:first-child").hasClass("active")) {
            $(".thumb .active").removeClass("active").prev().addClass("active");
        }

    });

    scrollContent.bind('mousewheel', function (event, delta) {
        this.scrollLeft -= (delta * 30);
        event.preventDefault();
    });


})
