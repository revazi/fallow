# Benchmarking

Fallow uses Criterion-compatible Rust benchmarks with CodSpeed simulation in
`.github/workflows/bench.yml`. The workflow is intentionally split into small
shards so PR feedback stays useful and noisy suites do not hide real
regressions.

## Shards

Fast PR shards:

- `fallow-core/analysis`: core parser, graph, cache, resolver, and duplicate
  detector paths.
- `fallow-benchmarks/programmatic_stable`: deterministic programmatic API,
  session reuse, warm parse-cache, and health-cache paths.
- `fallow-benchmarks/representative_sources`: focused source-shape extraction
  probes.

Full main/manual shards:

- `fallow-core/scaling_analysis`: larger synthetic scaling probes.
- `fallow-core/large_analysis`: broad high-cost analysis probes.

`programmatic_commands` still exists for local walltime investigation, but it
contains git/audit scenarios and must not run in the fast CodSpeed matrix.

## Adding Benchmarks

Use the smallest shard that matches the path being measured:

- Add stable API/session/cache coverage to `programmatic_stable`.
- Add source-shape extraction probes to `representative_sources`.
- Add broad parser, graph, cache, or duplication probes to `analysis`.
- Add large synthetic or high-variance probes only to full shards.

Keep benchmark names globally unique across `crates/*/benches/*.rs`.
Benchmarks in `programmatic_stable` must use the `stable_` prefix because they
are part of the fast PR regression signal.

## Validation

Run this before changing benchmark matrices or bench targets:

```bash
python3 scripts/check-benchmark-harness.py
cargo check -p fallow-benchmarks --benches
cargo check -p fallow-core --benches
```

For local signal, prefer targeted Criterion runs:

```bash
cargo bench -p fallow-benchmarks --bench programmatic_stable <filter> -- --sample-size 10
cargo bench -p fallow-core --bench analysis <filter> -- --sample-size 10
```

Use CodSpeed CI as the release-grade signal. Local `cargo codspeed` runs are
useful smoke checks, but the GitHub workflow is the source of truth for tracked
performance reports.
