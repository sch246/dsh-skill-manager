# Candidate 1 lifecycle

Realization: `skill-manager-linux-web-0.1.0-candidate.1`

Implementation identity: `dsh-skill-manager` commit `c374b087c6a4bb463c3e1cba17ac3009507ed8a7`.

Install:

```bash
cd /root/dsh-skill-manager
DSH_CHECKOUT=/root/deepseek-harness bash scripts/setup.sh
```

Uninstall:

```bash
cd /root/dsh-skill-manager
DSH_CHECKOUT=/root/deepseek-harness bash scripts/uninstall.sh
```

Setup accepts only the exact forward or reverse patch state, verifies representative nearby package locators, records ownership immediately after applying the seam, regenerates shared catalogs, rebuilds affected artifacts, and links the package into the selected profile. A completed receipt is written only after profile registration succeeds.

Uninstall removes the profile contribution and reverses Host source only when the same setup owns the exact patch and it still reverse-applies, then regenerates shared catalogs so other packages' entries remain. Restart remains a separate explicit operation and was not performed while sealing this candidate.
