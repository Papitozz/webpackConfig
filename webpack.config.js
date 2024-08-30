const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development', // Устанавливаем режим разработки
    entry: {
        main: './src/js/main.js', // Точка входа для основного файла JavaScript
        slider: './src/js/slider.js', // Точка входа для файла JavaScript слайдера
    },
    output: {
        path: path.resolve(__dirname, 'dist/js'), // Путь для выходных файлов (скриптов)
    },
    devtool: 'source-map', // Включаем создание source maps для отладки
    module: {
        rules: [
            {
                test: /\.scss$/, // Правило для обработки файлов .scss
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'] // Лоадеры для компиляции SCSS в CSS и вставки стилей в DOM
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
          cleanOnceBeforeBuildPatterns: [
            path.resolve(__dirname, 'dist'),
          ],
        }),
        // Плагин для извлечения CSS в отдельные файлы
        new MiniCssExtractPlugin({
            filename: '../css/[name].css', // Имя выходных CSS файлов
        }),
        // Плагин для копирования файлов (например, изображений) в выходную директорию
        new CopyWebpackPlugin({
            patterns: [
                {from: 'src/assets/img/', to: '../img/'}, // Копируем файлы из src/assets/img/ в dist/img/
                {from: 'src/assets/server.php', to: '../'}
            ]
        }),
        // Плагин для генерации HTML-файла на основе шаблона
        new HtmlWebpackPlugin({
            filename: '../index.html', // Имя выходного HTML-файла
            template: 'src/index.html', // Путь к исходному HTML-шаблону
            inject: false, // Отключаем автоматическое добавление <script> и <link> тегов
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
          new CssMinimizerPlugin(),
    ],
    
    watch: true, // Включаем вотчер для автоматической пересборки при изменениях
    watchOptions: {
        ignored: /node_modules/, // Исключаем папку node_modules из отслеживания
        aggregateTimeout: 300,   // Задержка перед пересборкой после изменений (мс)
        poll: 1000, // Частота опроса изменений (мс)
    }
}