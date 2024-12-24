<section>
    <header>
        <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">
            {{ __('API Token') }}
        </h2>

        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {{ __("Verifica tu token de la API.") }}
        </p>
    </header>

    <form method="post" action="{{ route('profile.update.token') }}" class="mt-6 space-y-6">
        @csrf
        @method('patch')

        <div>
            <x-input-label for="api_token" :value="__('API Token')" />
            <x-text-input id="areasTexto" name="api_token" type="text" class="mt-1 block w-full" :value="old('api_token', $user->api_token)" required autofocus />
            <x-input-error class="mt-2" :messages="$errors->get('api_token')" />
        </div>

        <div class="flex items-center gap-4">
            <x-primary-button>{{ __('Guardar') }}</x-primary-button>

            @if (session('status') === 'token-updated')
                <p
                    x-data="{ show: true }"
                    x-show="show"
                    x-transition
                    x-init="setTimeout(() => show = false, 2000)"
                    class="text-sm text-gray-600 dark:text-gray-400"
                >{{ __('Token updated successfully.') }}</p>
            @endif
        </div>
    </form>
</section>
