<!-- @format -->

[![Donate](https://img.shields.io/badge/donate-dyaka.com-red?style=plastic)](https://css_notes.dyaka.com/startpack)

# Easy-webdev-startpack

![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/budfy/easy-webdev-startpack?style=plastic) ![GitHub release (latest by date)](https://img.shields.io/github/v/release/budfy/Easy-webdev-startpack?style=plastic) ![GitHub last commit](https://img.shields.io/github/last-commit/budfy/easy-webdev-startpack?style=plastic) ![GitHub Repo stars](https://img.shields.io/github/stars/budfy/Easy-webdev-startpack?style=plastic) ![GitHub forks](https://img.shields.io/github/forks/budfy/Easy-webdev-startpack?style=plastic)

## Сборка Gulp4 с плагинами для разработки вебпроектов.

Вы можете поддержать разработку проекта, перейдя [по ссылке](https://css_notes.diaka.ua/startpack) и оставив мне что-то на кофе.

[![Мануал по работе со сборкой Easy-webdev-startpack](http://img.youtube.com/vi/_j38UEpskPU/0.jpg)](http://www.youtube.com/watch?v=_j38UEpskPU "Мануал по работе со сборкой Easy-webdev-startpack")

Смотрите [вики](https://github.com/budfy/Easy-webdev-startpack/wiki) сборки, чтобы узнать, как ею пользоваться правильно. В вики справа есть разделы и они по мере наличия времени и возникновения вопросов дополняются.
![Разделы вики](http://dl3.joxi.net/drive/2020/05/30/0024/1564/1599004/04/b9d9794244.png)

## Что есть в сборке:

- компилятор для препроцессора scss/sass;
- минификация готового css;
- автопрефиксер;
- импорт одних файлов в другие, который позволяет собирать html из модулей;
- babel;
- конвертация шрифтов из ttf в eot, woff и woff2;
- полуавтоматическое формирование и подключение @font-face;
- для живого обновления страниц - browsersync;
- карта исходников для отображения в браузере, из какого scss взят кусок css;
- сжатие изображений;
- адекватное сжатие png через pngquant;
- сжатие svg;
- создание svg-спрайтов и конвертация svg в background-image;
- ~~конвертация растровых изображений в webp и **автозамена в html и css ресурсов** для загрузки webp и подмены на jpg/png если браузер не понимает~~ **удалено из текущей версии в связи с неработоспособностью плагинов**;
- живая перезагрузка при работе с PHP (совместно с openserver);
- вывод размеров файлов в консоли во время работы gulp (для понимания, что сжалось и на сколько);

## Тасклист следующей версии:

- создание png-спрайтов;
- разделение задач на dev и build (работа с разными плагинами и вызов разными командами);
- etc.

## Об ошибках, пожалуйста, сообщайте в [ишьюс](https://github.com/budfy/Easy-webdev-startpack/issues). Там же можно оставить свои предложения по функционалу сборки.
