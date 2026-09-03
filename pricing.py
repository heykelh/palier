"""Coeur Revenue Management - deterministe (aucun LLM).
Demande lineaire calibree localement -> prix maximisant le revenu."""

def optimal_price(prix_ref: float, elasticite: float) -> float:
    """p* = prix_ref * (1+e) / (2e). Independant du volume q_ref."""
    if elasticite <= 0:
        raise ValueError("elasticite doit etre > 0")
    return prix_ref * (1 + elasticite) / (2 * elasticite)

def revenue(prix_ref, q_ref, elasticite, p):
    b = elasticite * q_ref / prix_ref
    a = q_ref * (1 + elasticite)
    d = max(a - b * p, 0.0)
    return d, p * d

def recommend(prix_ref, elasticite, prix_min, prix_max, q_ref=100.0):
    p_star = optimal_price(prix_ref, elasticite)
    p_clip = min(max(p_star, prix_min), prix_max)  # borne a la grille existante
    _, r_ref = revenue(prix_ref, q_ref, elasticite, prix_ref)
    _, r_star = revenue(prix_ref, q_ref, elasticite, p_clip)
    gain = (r_star - r_ref) / r_ref * 100 if r_ref else 0.0
    sens = "hausse" if p_clip > prix_ref else ("baisse" if p_clip < prix_ref else "stable")
    return dict(prix_ref=round(prix_ref, 2), prix_optimal_theorique=round(p_star, 2),
                prix_recommande=round(p_clip, 2), sens=sens,
                gain_revenu_pct=round(gain, 1), elasticite=elasticite)
