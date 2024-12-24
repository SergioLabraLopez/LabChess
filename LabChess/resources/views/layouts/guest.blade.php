<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        <!-- @vite(['resources/css/app.css', 'resources/js/app.js']) -->
        <link rel="stylesheet" href="{{ asset('css/usuario/accesoUsuario.css') }}">
    </head>
    <body class="font-sans text-gray-900 antialiased">
        <div class="min-h-screen flex flex-col justify-center items-center pt-3 sm:pt-0 bg-gray-100 dark:bg-gray-900">
            <!-- Logo -->
            <div id="logo" class="mb-6">
                <a href="/">
                    <img src="{{ asset('../storage/icons/logo.png') }}" alt="Logo">
                </a>
            </div>

            <!-- Formulario -->
            <div class="mb-6">
                {{ $slot }}
            </div>
        </div>
    </body>
</html>
