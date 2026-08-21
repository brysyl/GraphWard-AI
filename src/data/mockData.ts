import { Repository, ASTNode, ASTEdge, CVERecord, PRDiff, RCLILog, EnterpriseSettings, ExecutiveMetrics } from '../types';

export const mockRepositories: Repository[] = [
  {
    id: 'repo-auth',
    name: 'auth-service',
    repoUrl: 'git@internal.corp.network:security/auth-service.git',
    loc: 2500000,
    branch: 'main',
    primaryLang: 'Python / Cython',
    healthScore: 94.2,
    astNodeCount: 2104,
    criticalCves: 1,
    highCves: 3,
    mediumCves: 7,
    verifiedPRs: 48,
  },
  {
    id: 'repo-payment',
    name: 'payment-gateway',
    repoUrl: 'git@internal.corp.network:fintech/payment-gateway.git',
    loc: 1840000,
    branch: 'release/v4.2',
    primaryLang: 'Go (Golang 1.23)',
    healthScore: 98.6,
    astNodeCount: 1680,
    criticalCves: 0,
    highCves: 1,
    mediumCves: 4,
    verifiedPRs: 62,
  },
  {
    id: 'repo-userdb',
    name: 'user-db-cluster',
    repoUrl: 'git@internal.corp.network:platform/user-db-cluster.git',
    loc: 3200000,
    branch: 'main',
    primaryLang: 'Rust / C++',
    healthScore: 96.8,
    astNodeCount: 2940,
    criticalCves: 0,
    highCves: 2,
    mediumCves: 5,
    verifiedPRs: 39,
  },
  {
    id: 'repo-vault',
    name: 'token-vault',
    repoUrl: 'git@internal.corp.network:crypto/token-vault.git',
    loc: 920000,
    branch: 'main',
    primaryLang: 'TypeScript / Node',
    healthScore: 99.1,
    astNodeCount: 840,
    criticalCves: 0,
    highCves: 1,
    mediumCves: 2,
    verifiedPRs: 35,
  },
];

export const mockExecutiveMetrics: ExecutiveMetrics = {
  technicalDebtBaselineUSD: 2410000,
  technicalDebtRemediatedUSD: 1820000,
  activeCves: {
    critical: 1,
    high: 7,
    medium: 18,
    low: 34,
  },
  mttrBaselineDays: 205,
  mttrCurrentMinutes: 14,
  zeroBreakagePassRate: 100.0,
  totalVerificationsRun: 1842,
  regressionsCount: 0,
  totalLocAnalyzed: 2500000,
  prsMergedAutonomous: 184,
};

export const mockASTNodes: ASTNode[] = [
  {
    id: 'node-auth-root',
    label: 'auth_service.py',
    type: 'module',
    file: 'services/auth_service.py',
    loc: 1420,
    lineStart: 1,
    lineEnd: 1420,
    complexity: 18,
    infected: true,
    cveId: 'CVE-2026-3182',
    cveTitle: 'JWT Algorithm Confusion & None Alg Bypass',
    cveSeverity: 'CRITICAL',
    cwe: 'CWE-347',
    taintedVars: ['jwt_raw_header', 'algo_header', 'unverified_payload'],
    callDependencies: ['node-jwt-verify', 'node-claims-parse', 'node-session-store'],
    incomingCalls: ['node-http-router'],
    astDepth: 1,
    x: 420,
    y: 200,
  },
  {
    id: 'node-jwt-verify',
    label: 'validate_jwt_signature()',
    type: 'function',
    file: 'services/auth_service.py',
    loc: 140,
    lineStart: 72,
    lineEnd: 212,
    complexity: 12,
    infected: true,
    cveId: 'CVE-2026-3182',
    cveTitle: 'Insecure Algorithm Negotiation (Line 84)',
    cveSeverity: 'CRITICAL',
    cwe: 'CWE-347',
    taintedVars: ['header.alg', 'signature_bytes'],
    callDependencies: ['node-crypto-hmac', 'node-pubkey-cache'],
    incomingCalls: ['node-auth-root'],
    astDepth: 2,
    x: 640,
    y: 120,
  },
  {
    id: 'node-crypto-hmac',
    label: 'constant_time_hmac_verify()',
    type: 'function',
    file: 'crypto/hmac_util.py',
    loc: 48,
    lineStart: 14,
    lineEnd: 62,
    complexity: 3,
    infected: false,
    taintedVars: [],
    callDependencies: ['node-native-crypto'],
    incomingCalls: ['node-jwt-verify'],
    astDepth: 3,
    x: 880,
    y: 90,
  },
  {
    id: 'node-native-crypto',
    label: 'libcrypto.so::EVP_DigestVerify()',
    type: 'import',
    file: 'lib/native/crypto.so',
    loc: 0,
    lineStart: 0,
    lineEnd: 0,
    complexity: 1,
    infected: false,
    astDepth: 4,
    x: 1090,
    y: 90,
  },
  {
    id: 'node-claims-parse',
    label: 'parse_and_sanitize_claims()',
    type: 'function',
    file: 'services/auth_service.py',
    loc: 85,
    lineStart: 215,
    lineEnd: 300,
    complexity: 6,
    infected: false,
    callDependencies: ['node-rbac-evaluator'],
    incomingCalls: ['node-auth-root'],
    astDepth: 2,
    x: 640,
    y: 280,
  },
  {
    id: 'node-rbac-evaluator',
    label: 'evaluate_role_matrix()',
    type: 'function',
    file: 'security/rbac.py',
    loc: 110,
    lineStart: 45,
    lineEnd: 155,
    complexity: 7,
    infected: false,
    incomingCalls: ['node-claims-parse'],
    astDepth: 3,
    x: 880,
    y: 280,
  },
  {
    id: 'node-session-store',
    label: 'RedisSessionCache',
    type: 'class',
    file: 'storage/session_cache.py',
    loc: 310,
    lineStart: 20,
    lineEnd: 330,
    complexity: 9,
    infected: false,
    callDependencies: ['node-redis-driver'],
    incomingCalls: ['node-auth-root'],
    astDepth: 2,
    x: 640,
    y: 420,
  },
  {
    id: 'node-redis-driver',
    label: 'redis.asyncio.ConnectionPool',
    type: 'import',
    file: 'storage/session_cache.py',
    loc: 0,
    lineStart: 1,
    lineEnd: 1,
    complexity: 1,
    infected: false,
    astDepth: 3,
    x: 880,
    y: 420,
  },
  {
    id: 'node-http-router',
    label: 'OAuthV2Router (/v2/token)',
    type: 'module',
    file: 'routers/oauth.py',
    loc: 480,
    lineStart: 1,
    lineEnd: 480,
    complexity: 14,
    infected: false,
    callDependencies: ['node-auth-root'],
    astDepth: 1,
    x: 180,
    y: 200,
  },
  {
    id: 'node-test-suite',
    label: 'test_jwt_auth_matrix.py',
    type: 'test',
    file: 'tests/test_jwt_auth_matrix.py',
    loc: 520,
    lineStart: 1,
    lineEnd: 520,
    complexity: 8,
    infected: false,
    callDependencies: ['node-auth-root'],
    astDepth: 2,
    x: 420,
    y: 460,
  },
  {
    id: 'node-payment-crypto',
    label: 'crypto/vault.go',
    type: 'module',
    file: 'crypto/vault.go',
    loc: 890,
    lineStart: 1,
    lineEnd: 890,
    complexity: 15,
    infected: true,
    cveId: 'CVE-2026-4401',
    cveTitle: 'AES-GCM Static Nonce IV Re-use',
    cveSeverity: 'HIGH',
    cwe: 'CWE-329',
    taintedVars: ['fixed_iv_buffer', 'gcm_cipher_state'],
    callDependencies: ['node-aes-gcm-func'],
    incomingCalls: [],
    astDepth: 1,
    x: 180,
    y: 600,
  },
  {
    id: 'node-aes-gcm-func',
    label: 'EncryptPayloadAESGCM()',
    type: 'function',
    file: 'crypto/vault.go',
    loc: 95,
    lineStart: 104,
    lineEnd: 199,
    complexity: 8,
    infected: true,
    cveId: 'CVE-2026-4401',
    cveSeverity: 'HIGH',
    cwe: 'CWE-329',
    callDependencies: ['node-csprng'],
    incomingCalls: ['node-payment-crypto'],
    astDepth: 2,
    x: 420,
    y: 600,
  },
  {
    id: 'node-csprng',
    label: 'crypto/rand.Reader',
    type: 'import',
    file: 'crypto/vault.go',
    loc: 0,
    lineStart: 4,
    lineEnd: 4,
    complexity: 1,
    infected: false,
    astDepth: 3,
    x: 640,
    y: 600,
  },
];

export const mockASTEdges: ASTEdge[] = [
  { id: 'e1', source: 'node-http-router', target: 'node-auth-root', label: 'invokes dispatch', type: 'call' },
  { id: 'e2', source: 'node-auth-root', target: 'node-jwt-verify', label: 'calls AST validator', type: 'call', isVulnerablePath: true },
  { id: 'e3', source: 'node-jwt-verify', target: 'node-crypto-hmac', label: 'signature verification', type: 'call', isVulnerablePath: true },
  { id: 'e4', source: 'node-crypto-hmac', target: 'node-native-crypto', label: 'EVP bindings', type: 'imports' },
  { id: 'e5', source: 'node-auth-root', target: 'node-claims-parse', label: 'sanitizes payload', type: 'dataflow' },
  { id: 'e6', source: 'node-claims-parse', target: 'node-rbac-evaluator', label: 'evaluates permissions', type: 'call' },
  { id: 'e7', source: 'node-auth-root', target: 'node-session-store', label: 'caches token state', type: 'call' },
  { id: 'e8', source: 'node-session-store', target: 'node-redis-driver', label: 'pool connection', type: 'imports' },
  { id: 'e9', source: 'node-test-suite', target: 'node-auth-root', label: '142 sandboxed tests', type: 'call' },
  { id: 'e10', source: 'node-payment-crypto', target: 'node-aes-gcm-func', label: 'invokes cipher', type: 'call', isVulnerablePath: true },
  { id: 'e11', source: 'node-aes-gcm-func', target: 'node-csprng', label: 'CSPRNG entropy', type: 'imports' },
];

export const mockCVEList: CVERecord[] = [
  {
    id: 'CVE-2026-3182',
    title: 'JWT Insecure Algorithm Negotiation & None-Alg Header Bypass',
    severity: 'CRITICAL',
    cwe: 'CWE-347: Improper Verification of Cryptographic Signature',
    file: 'services/auth_service.py',
    line: 84,
    scanner: 'Semgrep',
    status: 'AUTO_PATCHING',
    fixIteration: 2,
    prId: 'PR-482',
    mttrMinutes: 14,
    description: 'The validate_jwt_signature parser permits unsigned tokens when the header alg field specifies "none" or "HS256" with asymmetric keys, allowing token forgery.',
    exploitRisk: 'Remote unauthenticated administrative privilege escalation via forged session tokens.',
    discoveredAt: '2026-08-21 07:12:04 UTC',
  },
  {
    id: 'CVE-2026-4401',
    title: 'AES-GCM Static Nonce Re-use in Transaction Ledger Payload Encryption',
    severity: 'HIGH',
    cwe: 'CWE-329: Generation of Predictable IV with CBC/GCM Mode',
    file: 'crypto/vault.go',
    line: 118,
    scanner: 'SonarQube',
    status: 'REMEDIATED',
    fixIteration: 1,
    prId: 'PR-479',
    mttrMinutes: 11,
    description: 'Fixed 12-byte initialization vector reused across subsequent encryption calls, exposing plaintext through XOR delta differential cryptanalysis.',
    exploitRisk: 'Cryptographic plaintext recovery of PCI cardholder PAN data.',
    discoveredAt: '2026-08-20 18:40:11 UTC',
    remediatedAt: '2026-08-20 18:51:24 UTC',
  },
  {
    id: 'CVE-2026-1928',
    title: 'Connection Pool Memory Safety & Use-After-Free in Async Worker Pool',
    severity: 'HIGH',
    cwe: 'CWE-416: Use After Free',
    file: 'user_db/session.rs',
    line: 242,
    scanner: 'Bandit',
    status: 'REMEDIATED',
    fixIteration: 1,
    prId: 'PR-476',
    mttrMinutes: 16,
    description: 'Unsafe raw pointer dereference during high-contention timeout teardown allowed corrupted heap chunk references.',
    exploitRisk: 'Worker thread segfault & remote memory leak denial of service.',
    discoveredAt: '2026-08-20 14:15:00 UTC',
    remediatedAt: '2026-08-20 14:31:02 UTC',
  },
  {
    id: 'CVE-2026-5590',
    title: 'Prototype Pollution in Token Claims Deep Sanitizer Parser',
    severity: 'HIGH',
    cwe: 'CWE-1321: Improperly Controlled Modification of Object Prototype Attributes',
    file: 'token_vault/signer.ts',
    line: 67,
    scanner: 'Snyk',
    status: 'REMEDIATED',
    fixIteration: 2,
    prId: 'PR-471',
    mttrMinutes: 9,
    description: 'Recursive JSON merge utility does not sanitize __proto__ or constructor keys, permitting prototype poisoning.',
    exploitRisk: 'Arbitrary property injection altering global runtime security parameters.',
    discoveredAt: '2026-08-19 22:04:19 UTC',
    remediatedAt: '2026-08-19 22:13:40 UTC',
  },
  {
    id: 'CVE-2026-8812',
    title: 'Unescaped SQL Predicate in Dynamic Filter Query Builder',
    severity: 'MEDIUM',
    cwe: 'CWE-89: SQL Injection',
    file: 'storage/query_builder.py',
    line: 154,
    scanner: 'Semgrep',
    status: 'QUEUED',
    fixIteration: 0,
    mttrMinutes: 0,
    description: 'String interpolation in sub-tenant filter parameters creates potential secondary blind SQL injection vector.',
    exploitRisk: 'Tenant data isolation bypass under custom query filters.',
    discoveredAt: '2026-08-21 06:55:20 UTC',
  },
];

export const mockPRDiffs: PRDiff[] = [
  {
    id: 'pr-482',
    prNumber: 482,
    title: 'fix(auth): enforce strict HMAC algorithm validation & reject algorithm confusion in validate_jwt_signature',
    cveId: 'CVE-2026-3182',
    branch: 'graphward/patch-cve-2026-3182-autofix',
    file: 'services/auth_service.py',
    language: 'python',
    originalCode: `def validate_jwt_signature(raw_token: str, key_registry: KeyStore) -> dict:
    header_b64, payload_b64, signature_b64 = raw_token.split(".")
    header = json.loads(base64.urlsafe_b64decode(header_b64 + "=="))
    payload = json.loads(base64.urlsafe_b64decode(payload_b64 + "=="))
    
    # VULNERABLE: Insecure algorithm negotiation & 'none' acceptance
    algo = header.get("alg", "none")
    if algo == "none":
        # Skip verification for debugging/internal tokens
        return payload
        
    key = key_registry.get_key(header.get("kid"))
    expected_sig = hmac.new(key.encode(), f"{header_b64}.{payload_b64}".encode(), hashlib.sha256).digest()
    
    if base64.urlsafe_b64decode(signature_b64 + "==") == expected_sig:
        return payload
    raise AuthenticationError("Invalid signature")`,
    patchedCode: `def validate_jwt_signature(raw_token: str, key_registry: KeyStore) -> dict:
    parts = raw_token.split(".")
    if len(parts) != 3:
        raise AuthenticationError("Malformed token structure: must contain header, payload, and signature")
    header_b64, payload_b64, signature_b64 = parts
    
    # Enforce strict base64 padding & JSON decode limits
    header = json.loads(base64.urlsafe_b64decode(header_b64 + "=="))
    payload = json.loads(base64.urlsafe_b64decode(payload_b64 + "=="))
    
    # SECURE: Explicit whitelist validation, reject 'none' unconditionally
    ALLOWED_ALGORITHMS = {"HS256", "HS384", "HS512"}
    algo = header.get("alg")
    if not algo or algo not in ALLOWED_ALGORITHMS:
        raise SecurityException(f"Unsupported or forbidden JWT algorithm: {algo}")
        
    kid = header.get("kid")
    if not kid or not key_registry.has_key(kid):
        raise SecurityException(f"Invalid or missing key ID (kid): {kid}")
        
    key = key_registry.get_key(kid)
    digest_mod = hashlib.sha256 if algo == "HS256" else (hashlib.sha384 if algo == "HS384" else hashlib.sha512)
    expected_sig = hmac.new(key.encode('utf-8'), f"{header_b64}.{payload_b64}".encode('utf-8'), digest_mod).digest()
    
    # Use constant-time comparison to prevent side-channel timing attacks
    provided_sig = base64.urlsafe_b64decode(signature_b64 + "==")
    if not hmac.compare_digest(provided_sig, expected_sig):
        raise AuthenticationError("Cryptographic signature verification failed")
        
    return payload`,
    originalASTSummary: 'FunctionDef: validate_jwt_signature -> If (alg == "none") return payload [TAINTED BYPASS]',
    patchedASTSummary: 'FunctionDef: validate_jwt_signature -> WhitelistSet {"HS256","HS384","HS512"} -> ConstantTime(hmac.compare_digest) [ZERO REGRESSION]',
    linterStatus: 'PASSED',
    linterDetails: 'Ruff / Flake8 / Black AST formatter: 0 warnings, 100% strict type hints',
    sastStatus: 'CLEARED',
    sastScanner: 'Semgrep Rule security.jwt.insecure-algo-check: PASSED (0 findings)',
    unitTestsTotal: 142,
    unitTestsPassed: 142,
    coveragePercent: 99.4,
    merged: false,
    iterationsCount: 2,
    author: 'GraphWard R-CLI Autoremediate Agent v4.8',
    createdAt: '2026-08-21 07:22:15 UTC',
  },
  {
    id: 'pr-479',
    prNumber: 479,
    title: 'fix(crypto): generate cryptographically secure random nonces per encryption call for AES-GCM cipher',
    cveId: 'CVE-2026-4401',
    branch: 'graphward/patch-cve-2026-4401-autofix',
    file: 'crypto/vault.go',
    language: 'go',
    originalCode: `func EncryptPayloadAESGCM(key []byte, plaintext []byte) ([]byte, error) {
    block, err := aes.NewCipher(key)
    if err != nil {
        return nil, err
    }
    gcm, err := cipher.NewGCM(block)
    if err != nil {
        return nil, err
    }
    // VULNERABLE: Static zeroed IV reused across every encryption
    nonce := make([]byte, gcm.NonceSize())
    return gcm.Seal(nil, nonce, plaintext, nil), nil
}`,
    patchedCode: `func EncryptPayloadAESGCM(key []byte, plaintext []byte) ([]byte, error) {
    block, err := aes.NewCipher(key)
    if err != nil {
        return nil, fmt.Errorf("failed to init aes block cipher: %w", err)
    }
    gcm, err := cipher.NewGCM(block)
    if err != nil {
        return nil, fmt.Errorf("failed to init gcm mode: %w", err)
    }
    
    // SECURE: Allocate high-entropy CSPRNG nonce for every invocation
    nonce := make([]byte, gcm.NonceSize())
    if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
        return nil, fmt.Errorf("entropy source failure: %w", err)
    }
    
    // Prepend nonce to ciphertext for authenticated decryption unpacking
    return gcm.Seal(nonce, nonce, plaintext, nil), nil
}`,
    originalASTSummary: 'FuncDecl: EncryptPayloadAESGCM -> make([]byte, gcm.NonceSize()) [STATIC ZEROED NONCE]',
    patchedASTSummary: 'FuncDecl: EncryptPayloadAESGCM -> io.ReadFull(rand.Reader, nonce) -> gcm.Seal(nonce, ...) [CSPRNG VERIFIED]',
    linterStatus: 'PASSED',
    linterDetails: 'golangci-lint (gosec, govet, staticcheck): 0 errors',
    sastStatus: 'CLEARED',
    sastScanner: 'SonarQube Go Security Rule S4426: PASSED',
    unitTestsTotal: 88,
    unitTestsPassed: 88,
    coveragePercent: 100.0,
    merged: true,
    mergeSha: '7f9c2d1b84e1',
    iterationsCount: 1,
    author: 'GraphWard R-CLI Autoremediate Agent v4.8',
    createdAt: '2026-08-20 18:50:00 UTC',
  },
  {
    id: 'pr-476',
    prNumber: 476,
    title: 'fix(session): wrap async worker connection handle in RAII Arc<Mutex<T>> to prevent use-after-free',
    cveId: 'CVE-2026-1928',
    branch: 'graphward/patch-cve-2026-1928-autofix',
    file: 'user_db/session.rs',
    language: 'rust',
    originalCode: `pub fn acquire_connection_pool(pool_ptr: *mut ConnectionPool) -> &'static mut ConnectionPool {
    // VULNERABLE: Raw pointer dereference without lifetime ownership enforcement
    unsafe {
        &mut *pool_ptr
    }
}`,
    patchedCode: `pub fn acquire_connection_pool(pool: Arc<tokio::sync::Mutex<ConnectionPool>>) -> Arc<tokio::sync::Mutex<ConnectionPool>> {
    // SECURE: Thread-safe reference counting with async Mutex guard
    Arc::clone(&pool)
}`,
    originalASTSummary: 'Fn: acquire_connection_pool -> unsafe { &mut *pool_ptr } [RAW POINTER DEREF]',
    patchedASTSummary: 'Fn: acquire_connection_pool -> Arc::clone(&pool) [SAFE MEMORY BOUNDARY]',
    linterStatus: 'PASSED',
    linterDetails: 'clippy --all-targets --all-features: 0 warnings',
    sastStatus: 'CLEARED',
    sastScanner: 'Bandit / Cargo-Audit: CLEARED',
    unitTestsTotal: 214,
    unitTestsPassed: 214,
    coveragePercent: 98.8,
    merged: true,
    mergeSha: '3a18e90cd54b',
    iterationsCount: 1,
    author: 'GraphWard R-CLI Autoremediate Agent v4.8',
    createdAt: '2026-08-20 14:30:12 UTC',
  },
];

export const mockInitialRCLILogs: RCLILog[] = [
  {
    id: 'log-1',
    timestamp: '07:28:10.104',
    level: 'INFO',
    message: 'GraphWard R-CLI Execution Harness v4.8.2-enterprise initialized.',
    subtext: 'Air-Gapped Private VPC mode: ENABLED | Engine: local-vLLM (Qwen-Coder-32B)',
  },
  {
    id: 'log-2',
    timestamp: '07:28:10.420',
    level: 'STEP',
    stepNumber: 1,
    message: 'Ingesting Repository AST Graph from auth-service (2,104 files processed in 412ms)...',
    subtext: 'Parsed 2,500,000 LOC | Mapped 18,490 call edges across 9 microservice boundaries',
  },
  {
    id: 'log-3',
    timestamp: '07:28:11.208',
    level: 'WARN',
    stepNumber: 2,
    message: 'Detected CVE-2026-3182 in services/auth_service.py (Line 84: Insecure Algorithm Negotiation)',
    subtext: 'CWE-347 | Severity: CRITICAL | Exploit Risk: JWT Header Algorithm confusion bypass',
  },
  {
    id: 'log-4',
    timestamp: '07:28:11.890',
    level: 'STEP',
    stepNumber: 3,
    message: 'GraphWard LLM generating precision AST diff with zero-regression boundary constraints...',
    subtext: 'Synthesizing AST patch node #729 (hmac.compare_digest + strict whitelist enforcement)',
  },
  {
    id: 'log-5',
    timestamp: '07:28:13.014',
    level: 'RESULT',
    stepNumber: 4,
    message: 'Executing local sandboxed pytest suite in gVisor container (Iteration 1)...',
    subtext: '141 passed, 1 failed in 2.14s: AssertionError in test_jwt_empty_header [test_jwt_auth_matrix.py:84]',
    codeSnippet: 'FAILED test_jwt_empty_header: AssertionError: expected SecurityException on empty alg, received KeyError',
  },
  {
    id: 'log-6',
    timestamp: '07:28:14.120',
    level: 'REMEDIATION',
    stepNumber: 5,
    message: 'Self-correcting AST patch (Iteration 2): Added explicit defensive NoneType check on header.get("alg")...',
    subtext: 'R-CLI auto-feedback loop engaged | Updating patch delta and re-compiling AST trees',
  },
  {
    id: 'log-7',
    timestamp: '07:28:16.480',
    level: 'SUCCESS',
    stepNumber: 6,
    message: 'All 142 unit tests passed cleanly (0 regressions, 0 test breakages, 99.4% coverage).',
    subtext: 'Pytest: 142/142 PASSED (1.89s) | Semgrep SAST: 0 CVE findings remaining',
  },
  {
    id: 'log-8',
    timestamp: '07:28:17.020',
    level: 'SUCCESS',
    stepNumber: 7,
    message: 'PR #482 submitted for automated merge: graphward/patch-cve-2026-3182-autofix',
    subtext: 'Signed with Enterprise Air-Gap Hardware Key (SHA-256: 4f8a29e...) | Ready for instant merge',
  },
];

export const mockEnterpriseSettings: EnterpriseSettings = {
  isAirGapped: true,
  vllmModel: 'Qwen-Coder-32B-Instruct (4-bit AWQ)',
  vramAllocGB: 48,
  contextWindow: 65536,
  sandboxType: 'gVisor Container',
  mcpServers: [
    {
      id: 'mcp-semgrep',
      name: 'Semgrep Enterprise Engine',
      status: 'CONNECTED',
      version: 'v1.84.0-airgap',
      endpoint: 'grpc://10.240.0.12:9091',
      type: 'SAST',
      rulesCount: 3420,
      latencyMs: 12,
    },
    {
      id: 'mcp-sonar',
      name: 'SonarQube Sovereign Scanner',
      status: 'CONNECTED',
      version: 'v10.6-enterprise',
      endpoint: 'http://10.240.0.14:9000',
      type: 'SAST',
      rulesCount: 5120,
      latencyMs: 18,
    },
    {
      id: 'mcp-bandit',
      name: 'Bandit Python AST Analyzer',
      status: 'CONNECTED',
      version: 'v1.7.9',
      endpoint: 'unix:///var/run/bandit.sock',
      type: 'Linter',
      rulesCount: 420,
      latencyMs: 4,
    },
    {
      id: 'mcp-snyk',
      name: 'Snyk Local Vulnerability DB',
      status: 'CONNECTED',
      version: 'v1.1290-offline',
      endpoint: 'grpc://10.240.0.18:9094',
      type: 'AST_Parser',
      rulesCount: 18400,
      latencyMs: 14,
    },
  ],
  autoMergeThreshold: 98,
  strictNoRegression: true,
  enforceConstantTimeVerification: true,
  logRetentionDays: 90,
  telemetryVPC: 'vpc-airgap-prod-eu-west2-10-240-0-0',
};

export const mockTrajectoryData = [
  { month: 'Month 1', baselineDebt: 2.41, remediatedDebt: 0.15, activeCves: 78, mttrDays: 205 },
  { month: 'Month 2', baselineDebt: 2.41, remediatedDebt: 0.48, activeCves: 64, mttrDays: 140 },
  { month: 'Month 3', baselineDebt: 2.41, remediatedDebt: 0.92, activeCves: 48, mttrDays: 75 },
  { month: 'Month 4', baselineDebt: 2.41, remediatedDebt: 1.34, activeCves: 32, mttrDays: 30 },
  { month: 'Month 5', baselineDebt: 2.41, remediatedDebt: 1.65, activeCves: 18, mttrDays: 8 },
  { month: 'Current (PoC)', baselineDebt: 2.41, remediatedDebt: 1.82, activeCves: 8, mttrDays: 0.01 },
];

export const mockTestCoverageMatrix = [
  { category: 'Unit Test Suites', total: 1240, passed: 1240, failed: 0, coverage: 98.6 },
  { category: 'Integration Call Graphs', total: 380, passed: 380, failed: 0, coverage: 94.2 },
  { category: 'End-to-End AST Harness', total: 110, passed: 110, failed: 0, coverage: 92.0 },
  { category: 'SAST Security Assertions', total: 94, passed: 94, failed: 0, coverage: 100.0 },
  { category: 'Fuzzing & Property Tests', total: 18, passed: 18, failed: 0, coverage: 89.5 },
];
