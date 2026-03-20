<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Mantenerlo minimalista: allow solo el origin configurado.
        $allowedOrigin = (string) env('FRONTEND_URL', 'http://localhost:5173');
        $origin = $request->headers->get('Origin');

        $responseOrigin = $origin && $origin === $allowedOrigin ? $origin : $allowedOrigin;

        $headers = [
            'Access-Control-Allow-Origin' => $responseOrigin,
            'Access-Control-Allow-Methods' => 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
            'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With',
            'Access-Control-Max-Age' => '86400',
            'Vary' => 'Origin',
        ];

        if ($request->getMethod() === 'OPTIONS') {
            $response = response()->noContent(200);
            foreach ($headers as $key => $value) {
                $response->headers->set($key, $value);
            }
            return $response;
        }

        $response = $next($request);
        foreach ($headers as $key => $value) {
            $response->headers->set($key, $value);
        }

        return $response;
    }
}

