# Plan: Angular Library

## Overview

This document outlines the plan for developing an Angular library. The library will be designed to provide reusable components, directives, and services that can be easily integrated into Angular applications. The goal is to create a maintainable, performant, and accessible library that follows Angular and TypeScript best practices.

## Library Structure

The library will be organized into the following domains:

### Themes

- Components: Theme switchers, layout shell components, and presentational controls.
- Services: Theme services, providers, tokens, and types.
- Directives: Theme directives for applying themes to components.
- Styles: Shared theme tokens and layout variables.
- Layout Shell: A set of components that provide a consistent layout structure for applications using the library.
- Icons: A collection of icons using `@lucide/angular` with `absoluteStrokeWidth` set.
- Entry Points: Each domain will have its own entry point for public APIs, such as `@ojiepermana/angular/theme/service`, `@ojiepermana/angular/theme/component`, and `@ojiepermana/angular/theme/directive`.
