    <link rel="stylesheet" href="{{ asset('css/header/navigation.css') }}">
    <script src="{{ asset('js/theme/theme-selector.js') }}" defer></script>

    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">

    <!-- Settings Dropdown -->
    <div class=" p-3 bg-dark">

        <div class="d-flex align-items-center">
            <div id="logo">
                <a href="{{ route('home') }}">
                    <img src="{{ asset('../storage/icons/logo.png') }}" alt="Logo"
                        style="max-width: 60px; height: auto;">
                </a>
            </div>

            <div class="flex-grow-1">
                <select class="{{ Route::currentRouteName() === 'partidaAltaDuracion' ? 'd-none' : '' }}" id="themeSelector">
                    <option value="default-theme">Predeterminado</option>
                    <option value="default-theme-black">Predeterminado Oscuro</option>
                    <option value="theme1">Tema 1</option>
                    <option value="theme2">Blue</option>
                    <option value="theme3">Green</option>
                    <option value="theme4">Red</option>
                    <option value="wood">Wood</option>
                    <option value="ice">Ice (Beta)</option>
                </select>
            </div>
            <div>
                <div class="flex-row-reverse">
                    @if (Auth::check())
                        <div class="d-flex align-items-center">
                            <!-- Mostrara el boton de perfil -->
                            <form method="POST" action="{{ route('logout') }}" class="d-inline">
                                @csrf <!-- Incluir el token CSRF para la protección -->
                                <button type="submit" class="btn btn-danger">Log out</button>
                            </form>
                            <a href="{{ route('profile.edit') }}" class="btn btn-success mx-2">Perfil</a>
                            @if (auth()->check() && auth()->user()->rol === 'admin')
                                <a href="{{ route('admin.panelControl') }}" class="btn btn-info m-2">Administrar</a>
                            @endif
                        </div>
                    @else
                        <!-- Muestra los botones de inicio de sesion y registarse -->
                        <a href="{{ route('login') }}" class="btn btn-primary m-2">Iniciar Sesión</a>
                        <a href="{{ route('register') }}" class="btn btn-success m-2">Registrarse</a>
                    @endif


                </div>
            </div>
        </div>
    </div>
