const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    mode: 'development', // Устанавливаем режим разработки
    entry: {
        main: './src/js/main.js', // Точка входа для основного файла JavaScript
        slider: './src/js/slider.js', // Точка входа для файла JavaScript слайдера
    },
    output: {
        path: path.resolve(__dirname, 'dist'), // Путь для выходных файлов (скриптов и стилей)
        filename: 'js/[name].bundle.js', // Путь и имя выходных JavaScript файлов
    },
    devtool: 'source-map', // Включаем создание source maps для отладки
    module: {
        rules: [
            {
                test: /\.scss$/, // Правило для обработки файлов .scss
                use: [
                    MiniCssExtractPlugin.loader, // Извлечение CSS в отдельный файл
                    'css-loader', // Загрузка CSS
                    'sass-loader' // Компиляция SCSS в CSS
                ]
            }
        ]
    },
    plugins: [
        // Плагин для извлечения CSS в отдельные файлы
        new MiniCssExtractPlugin({
            filename: 'css/[name].css', // Имя выходных CSS файлов
        }),
        // Плагин для копирования файлов (например, изображений) в выходную директорию
        new CopyWebpackPlugin({
            patterns: [
                {from: 'src/assets/img/', to: 'img/'} // Копируем файлы из src/assets/img/ в dist/img/
            ]
        }),
        // Плагин для генерации HTML-файла на основе шаблона
        new HtmlWebpackPlugin({
            filename: '../index.html', // Имя выходного HTML-файла
            template: 'src/index.html', // Путь к исходному HTML-шаблону
            inject: true, // Включаем автоматическое добавление <script> и <link> тегов
        }),
        // Плагин для минимизации изображений
        new ImageMinimizerPlugin({
            minimizer: {
              implementation: ImageMinimizerPlugin.imageminMinify, // Используем imagemin для минимизации
              options: {
                plugins: [
                  ['mozjpeg', { quality: 75 }], // Оптимизация JPEG с качеством 75
                  ['pngquant', { quality: [0.6, 0.8] }], // Оптимизация PNG с качеством 60-80%
                  ['svgo', {
                    plugins: [
                      {
                        name: 'removeViewBox',
                        active: false, // Не удалять атрибут viewBox в SVG
                      },
                    ],
                  }],
                ],
              },
            },
          }),
        // Плагин для минимизации CSS
        new CssMinimizerPlugin(),
    ],
    optimization: {
        minimize: true, // Включаем минимизацию
        minimizer: [
            '...', // Используем встроенные минимизаторы (например, TerserPlugin для JavaScript)
            new CssMinimizerPlugin(), // Добавляем плагин для минимизации CSS
        ],
    },
    watch: true, // Включаем вотчер для автоматической пересборки при изменениях
    watchOptions: {
        ignored: /node_modules/, // Исключаем папку node_modules из отслеживания
        aggregateTimeout: 300,   // Задержка перед пересборкой после изменений (мс)
        poll: 1000, // Частота опроса изменений (мс)
    }
};
