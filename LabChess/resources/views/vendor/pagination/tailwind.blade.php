@if ($paginator->hasPages())
    <nav class="pagination-nav" role="navigation" aria-label="{{ __('Pagination Navigation') }}">
        <div class="pagination-container">
            <!-- Previous Page -->
            <div class="pagination-item prev">
                @if ($paginator->onFirstPage())
                    <span class="disabled">
                        {!! __('pagination.previous') !!}
                    </span>
                @else
                    <a href="{{ $paginator->previousPageUrl() }}" class="pagination-link" aria-label="{{ __('pagination.previous') }}">
                        &laquo; {!! __('pagination.previous') !!}
                    </a>
                @endif
            </div>

            <!-- Page Info -->
            <div class="pagination-info">
                <p>
                    {!! __('Showing') !!}
                    @if ($paginator->firstItem())
                        <span>{{ $paginator->firstItem() }}</span>
                        {!! __('to') !!}
                        <span>{{ $paginator->lastItem() }}</span>
                    @else
                        {{ $paginator->count() }}
                    @endif
                    {!! __('of') !!}
                    <span>{{ $paginator->total() }}</span>
                    {!! __('results') !!}
                </p>
            </div>

            <!-- Next Page -->
            <div class="pagination-item next">
                @if ($paginator->hasMorePages())
                    <a href="{{ $paginator->nextPageUrl() }}" rel="next" aria-label="{{ __('pagination.next') }}" class="pagination-link">
                        {!! __('pagination.next') !!} &raquo;
                    </a>
                @else
                    <span class="disabled">
                        {!! __('pagination.next') !!}
                    </span>
                @endif
            </div>
        </div>

        <!-- Page Numbers -->
        <div class="pagination-pages">
            @foreach ($elements as $element)
                @if (is_string($element))
                    <span class="page-separator">{{ $element }}</span>
                @endif

                @if (is_array($element))
                    <div class="page-group">
                        @foreach ($element as $page => $url)
                            @if ($page == $paginator->currentPage())
                                <span class="page-current" aria-current="page">{{ $page }}</span>
                            @else
                                <a href="{{ $url }}" class="page-link" aria-label="{{ __('Go to page :page', ['page' => $page]) }}">{{ $page }}</a>
                            @endif
                        @endforeach
                    </div>
                @endif
            @endforeach
        </div>
    </nav>
@endif
