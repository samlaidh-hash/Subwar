// Sub War 2060 - Campaign System
// Progressive submarine warfare scenarios set in 2060

const CAMPAIGNS = {
    ARCTIC_SHADOW: {
        name: 'Arctic Shadow',
        description: 'A covert operation beneath the polar ice cap discovers a hidden threat to global security.',
        difficulty: 'Progressive',
        scenarios: [
            {
                id: 'as_01_recon',
                name: 'Silent Running',
                briefing: {
                    title: 'Mission 1: Silent Running',
                    background: 'Arctic Ocean, 2060. Intelligence suggests hostile submarine activity near research station Alpha-7. Your mission: conduct reconnaissance without being detected.',
                    objectives: [
                        'Reach waypoint NAV-1 undetected',
                        'Identify 2+ enemy contacts using passive sonar only',
                        'Return to base without engaging the enemy',
                        'Maintain sonar signature below 8 throughout mission'
                    ],
                    restrictions: [
                        'NO weapons fire - stealth mission only',
                        'Passive sonar only (no active pings)',
                        'Maximum speed: 15 knots'
                    ],
                    intel: 'Enemy patrol consists of 1-2 attack submarines. Unknown class and armament.'
                },
                dialogue_events: [
                    {
                        trigger: 'mission_start',
                        speaker: 'Command',
                        text: 'Alpha-7, this is Command. Intelligence reports enemy activity in your AO. How do you want to proceed?',
                        choices: [
                            {
                                id: 'stealth_approach',
                                text: 'Silent approach - minimal risk, comprehensive recon',
                                consequences: {
                                    reputation: { 'MARSHALL_AUTHORITY': 2 },
                                    scenario_modifier: { stealth_bonus: 1.5, detection_threshold: 0.8 }
                                }
                            },
                            {
                                id: 'aggressive_recon',
                                text: 'Fast recon - high risk, quick intelligence',
                                consequences: {
                                    reputation: { 'MARSHALL_AUTHORITY': -1 },
                                    scenario_modifier: { speed_bonus: 1.3, detection_threshold: 1.2 }
                                }
                            },
                            {
                                id: 'request_support',
                                text: 'Request backup before proceeding',
                                consequences: {
                                    reputation: { 'MARSHALL_AUTHORITY': -2, 'PACIFICA_FEDERATION': 1 },
                                    scenario_modifier: { ally_spawn: true, mission_time_extended: 300 }
                                }
                            }
                        ]
                    },
                    {
                        trigger: 'enemy_detected',
                        speaker: 'Sonar',
                        text: 'Captain, we have two contacts bearing 045 and 120. They haven\'t detected us yet. Orders?',
                        choices: [
                            {
                                id: 'observe_only',
                                text: 'Maintain distance and observe their patrol patterns',
                                consequences: {
                                    reputation: { 'DEEP_RESEARCH_ALLIANCE': 3 },
                                    intel_bonus: { enemy_behavior_patterns: true }
                                }
                            },
                            {
                                id: 'closer_inspection',
                                text: 'Move closer for detailed identification',
                                consequences: {
                                    risk_increase: 0.3,
                                    intel_bonus: { enemy_specifications: true }
                                }
                            },
                            {
                                id: 'abort_mission',
                                text: 'Too risky - abort and return to base',
                                consequences: {
                                    reputation: { 'MARSHALL_AUTHORITY': -5 },
                                    scenario_end: 'early_abort'
                                }
                            }
                        ]
                    }
                ],
                setup: {
                    playerStart: { x: -200, y: 0, z: -100, heading: 45 },
                    enemies: [
                        {
                            type: 'TYPHOON',
                            position: { x: 50, y: 0, z: -80 },
                            behavior: 'patrol',
                            route: [{ x: 50, z: -80 }, { x: 120, z: -50 }, { x: 80, z: -20 }],
                            alertLevel: 'low'
                        },
                        {
                            type: 'SQUALL',
                            position: { x: 180, y: 0, z: -120 },
                            behavior: 'guard',
                            alertLevel: 'medium'
                        }
                    ],
                    waypoints: [
                        { id: 'NAV-1', x: 100, z: -60, radius: 50 }
                    ],
                    environment: {
                        visibility: 'low',
                        thermals: 'single',
                        ice_coverage: 0.8,
                        ambient_noise: 3
                    }
                },
                victory: {
                    conditions: ['reach_waypoint:NAV-1', 'identify_contacts:2', 'return_base', 'stealth_maintained'],
                    unlocks: 'as_02_escort'
                },
                failure: {
                    conditions: ['detected_by_enemy', 'weapons_fired', 'sonar_signature_exceeded:8']
                }
            },

            {
                id: 'as_02_escort',
                name: 'Safe Passage',
                briefing: {
                    title: 'Mission 2: Safe Passage',
                    background: 'Based on your recon, Command is evacuating Research Station Alpha-7. You must escort the transport submarine \'Nereid\' through hostile waters.',
                    objectives: [
                        'Escort transport \'Nereid\' to extraction point ZULU',
                        'Engage and destroy any threats to the transport',
                        'Ensure transport survives with >50% hull integrity',
                        'Eliminate at least 2 enemy submarines'
                    ],
                    restrictions: [
                        'Stay within 200m of transport at all times',
                        'Transport has priority - protect it first'
                    ],
                    intel: 'Expect 3 enemy attack submarines. They know about the evacuation. Heavy torpedo loadout recommended.'
                },
                dialogue_events: [
                    {
                        trigger: 'mission_start',
                        speaker: 'Transport Nereid',
                        text: 'Escort vessel, this is Nereid. We have civilian scientists aboard. What\'s our escape route strategy?',
                        choices: [
                            {
                                id: 'fast_route',
                                text: 'Direct route - fastest but most exposed',
                                consequences: {
                                    reputation: { 'DEEP_RESEARCH_ALLIANCE': 2 },
                                    scenario_modifier: { route_exposure: 1.4, time_bonus: 180 }
                                }
                            },
                            {
                                id: 'safe_route',
                                text: 'Northern route through ice fields - slower but safer',
                                consequences: {
                                    reputation: { 'PACIFICA_FEDERATION': 3 },
                                    scenario_modifier: { route_exposure: 0.7, ice_cover_bonus: true }
                                }
                            },
                            {
                                id: 'decoy_route',
                                text: 'Send false signals first - confuse the enemy',
                                consequences: {
                                    reputation: { 'MARSHALL_AUTHORITY': 3 },
                                    scenario_modifier: { enemy_confusion: 300, detection_delay: true }
                                }
                            }
                        ]
                    },
                    {
                        trigger: 'enemy_ambush',
                        speaker: 'Combat Officer',
                        text: 'Captain! Three enemy submarines closing fast on Nereid. They\'re in a coordinated attack formation!',
                        choices: [
                            {
                                id: 'aggressive_intercept',
                                text: 'All ahead full - intercept the lead attacker',
                                consequences: {
                                    reputation: { 'MARSHALL_AUTHORITY': 4 },
                                    combat_modifier: { aggression_bonus: 1.3, hull_risk: 0.2 }
                                }
                            },
                            {
                                id: 'defensive_screen',
                                text: 'Form defensive screen around Nereid',
                                consequences: {
                                    reputation: { 'DEEP_RESEARCH_ALLIANCE': 5 },
                                    combat_modifier: { protection_bonus: 1.5, mobility_penalty: 0.8 }
                                }
                            },
                            {
                                id: 'tactical_withdrawal',
                                text: 'Fighting retreat to advantageous position',
                                consequences: {
                                    reputation: { 'PACIFICA_FEDERATION': 2 },
                                    combat_modifier: { positioning_bonus: 1.2, time_cost: 120 }
                                }
                            }
                        ]
                    },
                    {
                        trigger: 'civilian_request',
                        speaker: 'Dr. Sarah Chen',
                        text: 'This is Dr. Chen aboard Nereid. We have critical research data on enemy capabilities. Should we transmit it now or wait?',
                        choices: [
                            {
                                id: 'transmit_now',
                                text: 'Transmit immediately - intelligence is critical',
                                consequences: {
                                    reputation: { 'DEEP_RESEARCH_ALLIANCE': 4, 'MARSHALL_AUTHORITY': 2 },
                                    campaign_unlock: 'enemy_intelligence_bonus',
                                    risk_increase: 0.3
                                }
                            },
                            {
                                id: 'wait_for_safety',
                                text: 'Wait until we reach safety - avoid detection',
                                consequences: {
                                    reputation: { 'PACIFICA_FEDERATION': 3 },
                                    scenario_modifier: { stealth_maintained: true }
                                }
                            },
                            {
                                id: 'destroy_if_captured',
                                text: 'Prepare to destroy data if Nereid is compromised',
                                consequences: {
                                    reputation: { 'MARSHALL_AUTHORITY': 5, 'DEEP_RESEARCH_ALLIANCE': -3 },
                                    backup_plan: 'data_destruction_protocol'
                                }
                            }
                        ]
                    }
                ],
                setup: {
                    playerStart: { x: -150, y: 0, z: -80, heading: 90 },
                    allies: [
                        {
                            type: 'TRANSPORT',
                            name: 'Nereid',
                            position: { x: -120, y: 0, z: -80 },
                            behavior: 'follow_route',
                            route: [{ x: -120, z: -80 }, { x: 0, z: -60 }, { x: 150, z: -40 }, { x: 300, z: 0 }],
                            speed: 8,
                            hull: 100
                        }
                    ],
                    enemies: [
                        {
                            type: 'THUNDER',
                            position: { x: 80, y: 0, z: -100 },
                            behavior: 'intercept',
                            target: 'Nereid',
                            alertLevel: 'high'
                        },
                        {
                            type: 'TYPHOON',
                            position: { x: 200, y: 0, z: -20 },
                            behavior: 'ambush',
                            alertLevel: 'high'
                        },
                        {
                            type: 'TEMPEST',
                            position: { x: 250, y: 0, z: -80 },
                            behavior: 'hunter_killer',
                            alertLevel: 'maximum'
                        }
                    ],
                    waypoints: [
                        { id: 'ZULU', x: 300, z: 0, radius: 30 }
                    ],
                    environment: {
                        visibility: 'medium',
                        thermals: 'multiple',
                        ice_coverage: 0.6,
                        ambient_noise: 4
                    }
                },
                victory: {
                    conditions: ['escort_complete', 'enemies_destroyed:2', 'ally_survival:Nereid:50'],
                    unlocks: 'as_03_fortress'
                },
                failure: {
                    conditions: ['ally_destroyed:Nereid', 'too_far_from_escort:200']
                }
            },

            {
                id: 'as_03_fortress',
                name: 'Ice Fortress',
                briefing: {
                    title: 'Mission 3: Ice Fortress',
                    background: 'Nereid\'s data reveals a massive underwater installation beneath the ice shelf. This \'Ice Fortress\' appears to be a submarine construction facility - and it\'s building something big.',
                    objectives: [
                        'Infiltrate the Ice Fortress defensive perimeter',
                        'Destroy 4 construction bay power nodes',
                        'Eliminate the facility\'s guardian submarine \'Leviathan\'',
                        'Escape before facility self-destructs (5 minutes)'
                    ],
                    restrictions: [
                        'Limited to 12 total torpedoes for entire mission',
                        'No resupply available inside facility',
                        'Heavy torpedo recommended for Leviathan'
                    ],
                    intel: 'Fortress defended by automated defense turrets and 1 experimental heavy submarine \'Leviathan\'. Facility will self-destruct once core systems are damaged.'
                },
                setup: {
                    playerStart: { x: -300, y: 0, z: -150, heading: 45 },
                    structures: [
                        {
                            type: 'power_node',
                            id: 'node_1',
                            position: { x: 0, y: -20, z: -100 },
                            hull: 50,
                            shields: 25
                        },
                        {
                            type: 'power_node',
                            id: 'node_2',
                            position: { x: 50, y: -20, z: -50 },
                            hull: 50,
                            shields: 25
                        },
                        {
                            type: 'power_node',
                            id: 'node_3',
                            position: { x: 0, y: -20, z: 0 },
                            hull: 50,
                            shields: 25
                        },
                        {
                            type: 'power_node',
                            id: 'node_4',
                            position: { x: -50, y: -20, z: -50 },
                            hull: 50,
                            shields: 25
                        },
                        {
                            type: 'defense_turret',
                            position: { x: -100, y: -10, z: -75 },
                            range: 150,
                            damage: 40
                        },
                        {
                            type: 'defense_turret',
                            position: { x: 100, y: -10, z: -25 },
                            range: 150,
                            damage: 40
                        }
                    ],
                    enemies: [
                        {
                            type: 'LEVIATHAN', // Boss submarine
                            position: { x: 0, y: 0, z: -75 },
                            behavior: 'fortress_guardian',
                            hull: 300,
                            armor: 100,
                            weapons: ['heavy_torpedoes', 'defense_missiles'],
                            alertLevel: 'maximum'
                        }
                    ],
                    waypoints: [
                        { id: 'ESCAPE', x: -300, z: -150, radius: 50 }
                    ],
                    environment: {
                        visibility: 'high', // Inside facility
                        thermals: 'complex',
                        ice_coverage: 0.9, // Enclosed space
                        ambient_noise: 6,
                        time_limit: 300 // 5 minutes after nodes destroyed
                    }
                },
                victory: {
                    conditions: ['structures_destroyed:power_node:4', 'enemy_destroyed:LEVIATHAN', 'escape_complete'],
                    unlocks: 'campaign_complete',
                    rewards: ['achievement:ice_fortress', 'submarine_upgrade:advanced_sonar']
                },
                failure: {
                    conditions: ['time_limit_exceeded', 'ammunition_depleted', 'hull_critical']
                }
            }
        ],

        completion_reward: {
            title: 'Arctic Shadow Complete',
            description: 'You\'ve exposed and destroyed the Ice Fortress, preventing a new submarine arms race. The Arctic is safe... for now.',
            unlocks: ['campaign:pacific_storm', 'submarine:experimental_class'],
            achievements: ['arctic_veteran', 'stealth_master', 'fortress_breaker']
        }
    },

    PACIFIC_STORM: {
        name: 'Pacific Storm',
        description: 'Corporate warfare erupts in the Pacific as megacorporations battle for control of deep-sea mining rights.',
        difficulty: 'Hard',
        prerequisite: 'ARCTIC_SHADOW',
        scenarios: [
            {
                id: 'ps_01_mining',
                name: 'Deep Strike',
                briefing: {
                    title: 'Mission 1: Deep Strike',
                    background: 'Pacific Ocean, Deep Mining Zone 7. Titan Corporation\'s illegal mining operation is destroying the ocean floor. Poseidon Industries has hired you to \'persuade\' them to stop.',
                    objectives: [
                        'Destroy 6 automated mining platforms',
                        'Sink 2+ corporate security submarines',
                        'Avoid civilian casualties (research vessels)',
                        'Complete mission in under 15 minutes'
                    ],
                    restrictions: [
                        'DO NOT engage civilian research vessels',
                        'Mining platforms have heavy armor - use Heavy torpedoes'
                    ],
                    intel: 'Titan Corp uses THUNDER-class submarines for security. Mining platforms are heavily shielded but slow to move.'
                },
                setup: {
                    playerStart: { x: -200, y: -50, z: -200, heading: 30 },
                    structures: [
                        { type: 'mining_platform', id: 'platform_1', position: { x: 0, y: -80, z: -100 }, hull: 100 },
                        { type: 'mining_platform', id: 'platform_2', position: { x: 60, y: -80, z: -120 }, hull: 100 },
                        { type: 'mining_platform', id: 'platform_3', position: { x: 120, y: -80, z: -80 }, hull: 100 },
                        { type: 'mining_platform', id: 'platform_4', position: { x: 80, y: -80, z: -40 }, hull: 100 },
                        { type: 'mining_platform', id: 'platform_5', position: { x: 20, y: -80, z: -60 }, hull: 100 },
                        { type: 'mining_platform', id: 'platform_6', position: { x: -20, y: -80, z: -80 }, hull: 100 }
                    ],
                    enemies: [
                        {
                            type: 'THUNDER',
                            position: { x: 40, y: -40, z: -60 },
                            behavior: 'patrol',
                            route: [{ x: 40, z: -60 }, { x: 80, z: -100 }, { x: 120, z: -60 }],
                            alertLevel: 'medium'
                        },
                        {
                            type: 'THUNDER',
                            position: { x: 100, y: -40, z: -120 },
                            behavior: 'guard',
                            alertLevel: 'medium'
                        },
                        {
                            type: 'TEMPEST',
                            position: { x: 60, y: -30, z: -80 },
                            behavior: 'response_team',
                            alertLevel: 'low' // Activates when mining platforms attacked
                        }
                    ],
                    neutrals: [
                        {
                            type: 'RESEARCH_VESSEL',
                            position: { x: -50, y: -20, z: -150 },
                            behavior: 'survey',
                            hull: 25
                        },
                        {
                            type: 'RESEARCH_VESSEL',
                            position: { x: 150, y: -20, z: -40 },
                            behavior: 'survey',
                            hull: 25
                        }
                    ],
                    environment: {
                        visibility: 'medium',
                        thermals: 'deep_ocean',
                        depth: 2000,
                        ambient_noise: 5,
                        time_limit: 900 // 15 minutes
                    }
                },
                victory: {
                    conditions: ['structures_destroyed:mining_platform:6', 'enemies_destroyed:2', 'time_under:900', 'neutrals_safe'],
                    unlocks: 'ps_02_convoy'
                },
                failure: {
                    conditions: ['time_limit_exceeded', 'neutral_casualties', 'mission_compromised']
                }
            },

            {
                id: 'ps_02_convoy',
                name: 'Supply Line',
                briefing: {
                    title: 'Mission 2: Supply Line',
                    background: 'Poseidon Industries needs a critical supply convoy escorted to their deep-sea mining station. Corporate rivals are expected to attack.',
                    objectives: [
                        'Escort 3 cargo submarines to Deep Station Omega',
                        'Protect convoy from ambush attacks',
                        'Ensure at least 2 cargo subs survive',
                        'Eliminate escort-hunting submarines'
                    ],
                    restrictions: [
                        'Maintain formation with convoy',
                        'Cargo subs move slowly - plan accordingly'
                    ],
                    intel: 'Enemy using fast LIGHTNING scouts and heavy TSUNAMI carriers for coordinated attacks.'
                },
                dialogue_events: [
                    {
                        trigger: 'mission_start',
                        speaker: 'Convoy Commander',
                        text: 'Corporate wars are getting ugly, Captain. These cargo runs are vital to keeping the mining operations going. How aggressive should our escort be?',
                        choices: [
                            {
                                id: 'aggressive_escort',
                                text: 'Hunt down threats before they reach the convoy',
                                consequences: {
                                    reputation: { 'MINING_CONSORTIUM': 4, 'INDUSTRIAL_COALITION': 2 },
                                    scenario_modifier: { escort_range: 2.0, aggression_bonus: 1.3 }
                                }
                            },
                            {
                                id: 'defensive_escort',
                                text: 'Stay close and react to immediate threats only',
                                consequences: {
                                    reputation: { 'PACIFICA_FEDERATION': 3, 'MINING_CONSORTIUM': 1 },
                                    scenario_modifier: { protection_bonus: 1.5, mobility_penalty: 0.8 }
                                }
                            },
                            {
                                id: 'diplomatic_approach',
                                text: 'Attempt to negotiate safe passage with rivals',
                                consequences: {
                                    reputation: { 'DEEP_RESEARCH_ALLIANCE': 3, 'MINING_CONSORTIUM': -1 },
                                    dialogue_tree: 'corporate_negotiation'
                                }
                            }
                        ]
                    },
                    {
                        trigger: 'cargo_under_attack',
                        speaker: 'Cargo Captain',
                        text: 'We\'re taking heavy fire! My cargo hold is breached! Should we jettison the cargo to save the crew?',
                        choices: [
                            {
                                id: 'save_cargo',
                                text: 'Maintain course - the cargo is essential',
                                consequences: {
                                    reputation: { 'MINING_CONSORTIUM': 5, 'INDUSTRIAL_COALITION': 3 },
                                    risk_increase: 0.4,
                                    cargo_priority: true
                                }
                            },
                            {
                                id: 'save_crew',
                                text: 'Jettison cargo and evacuate crew immediately',
                                consequences: {
                                    reputation: { 'PACIFICA_FEDERATION': 6, 'MINING_CONSORTIUM': -2 },
                                    crew_safety: true,
                                    mission_partial_failure: true
                                }
                            },
                            {
                                id: 'emergency_repairs',
                                text: 'Emergency repair while we cover you',
                                consequences: {
                                    reputation: { 'INDUSTRIAL_COALITION': 4 },
                                    time_cost: 180,
                                    repair_chance: 0.7
                                }
                            }
                        ]
                    }
                ],
                setup: {
                    playerStart: { x: -200, y: -30, z: -100, heading: 90 },
                    allies: [
                        {
                            type: 'HAILSTORM',
                            name: 'Cargo-1',
                            position: { x: -180, y: -30, z: -80 },
                            behavior: 'convoy',
                            route: [{ x: -180, z: -80 }, { x: 0, z: -60 }, { x: 200, z: -40 }, { x: 400, z: 0 }],
                            speed: 6,
                            hull: 80
                        },
                        {
                            type: 'JUMBO',
                            name: 'Cargo-2',
                            position: { x: -180, y: -30, z: -100 },
                            behavior: 'convoy',
                            route: [{ x: -180, z: -100 }, { x: 0, z: -80 }, { x: 200, z: -60 }, { x: 400, z: -20 }],
                            speed: 5,
                            hull: 150
                        },
                        {
                            type: 'HAILSTORM',
                            name: 'Cargo-3',
                            position: { x: -180, y: -30, z: -120 },
                            behavior: 'convoy',
                            route: [{ x: -180, z: -120 }, { x: 0, z: -100 }, { x: 200, z: -80 }, { x: 400, z: -40 }],
                            speed: 6,
                            hull: 80
                        }
                    ],
                    enemies: [
                        {
                            type: 'LIGHTNING',
                            position: { x: 100, y: -20, z: -200 },
                            behavior: 'scout',
                            alertLevel: 'high'
                        },
                        {
                            type: 'LIGHTNING',
                            position: { x: 300, y: -20, z: 50 },
                            behavior: 'scout',
                            alertLevel: 'high'
                        },
                        {
                            type: 'TSUNAMI',
                            position: { x: 200, y: -40, z: -150 },
                            behavior: 'hunter_killer',
                            alertLevel: 'maximum'
                        }
                    ],
                    waypoints: [
                        { id: 'OMEGA', x: 400, z: -20, radius: 40 }
                    ],
                    environment: {
                        visibility: 'high',
                        thermals: 'trade_route',
                        depth: 1500,
                        ambient_noise: 4
                    }
                },
                victory: {
                    conditions: ['convoy_safe:2', 'enemies_destroyed:2', 'waypoint_reached:OMEGA'],
                    unlocks: 'ps_03_deep_strike'
                },
                failure: {
                    conditions: ['convoy_destroyed:2', 'convoy_lost']
                }
            },

            {
                id: 'ps_03_deep_strike',
                name: 'Abyssal Research',
                briefing: {
                    title: 'Mission 3: Abyssal Research',
                    background: 'Deep Research Alliance station is under attack by unknown forces in the abyssal depths. Your mission: reach the station and evacuate critical research data.',
                    objectives: [
                        'Reach Research Station at 3000m depth',
                        'Defend against deep-sea attackers',
                        'Escort QUEST-class research submarine to safety',
                        'Retrieve classified research data'
                    ],
                    restrictions: [
                        'Extreme depth - hull pressure warnings',
                        'Limited visibility in abyssal zone'
                    ],
                    intel: 'Unknown attackers using WHIRLWIND and CYCLONE deep-sea submarines. They know these waters.'
                },
                setup: {
                    playerStart: { x: -100, y: -50, z: -100, heading: 180 },
                    allies: [
                        {
                            type: 'QUEST',
                            name: 'Research-Alpha',
                            position: { x: 0, y: -300, z: 0 },
                            behavior: 'defend_station',
                            hull: 120
                        }
                    ],
                    enemies: [
                        {
                            type: 'WHIRLWIND',
                            position: { x: 150, y: -280, z: 100 },
                            behavior: 'deep_patrol',
                            alertLevel: 'high'
                        },
                        {
                            type: 'CYCLONE',
                            position: { x: -150, y: -300, z: -100 },
                            behavior: 'fortress_guardian',
                            alertLevel: 'maximum'
                        },
                        {
                            type: 'ADVENTURE',
                            position: { x: 100, y: -290, z: -150 },
                            behavior: 'intercept',
                            alertLevel: 'high'
                        }
                    ],
                    waypoints: [
                        { id: 'RESEARCH_STATION', x: 0, z: 0, depth: 3000, radius: 30 },
                        { id: 'ESCAPE', x: -200, z: -200, depth: 1000, radius: 50 }
                    ],
                    environment: {
                        visibility: 'very_low',
                        thermals: 'abyssal',
                        depth: 3000,
                        ambient_noise: 2,
                        pressure_warnings: true
                    }
                },
                victory: {
                    conditions: ['reach_station', 'escort_complete', 'data_retrieved', 'escape_complete'],
                    unlocks: 'ps_04_faction_war'
                },
                failure: {
                    conditions: ['research_station_destroyed', 'ally_destroyed', 'hull_pressure_failure']
                }
            }
        ]
    },

    FACTION_WARS: {
        name: 'Faction Wars',
        description: 'Choose your allegiance as the underwater nations clash for territorial control and resources.',
        difficulty: 'Expert',
        prerequisite: 'PACIFIC_STORM',
        scenarios: [
            {
                id: 'fw_01_marshall_patrol',
                name: 'Marshall Authority Patrol',
                faction: 'MARSHALL_AUTHORITY',
                briefing: {
                    title: 'Mission 1: Law and Order',
                    background: 'Join the Marshall Authority fleet in maintaining order in disputed waters. Pirates using stolen military submarines threaten civilian shipping.',
                    objectives: [
                        'Lead TEMPEST command submarine into patrol zone',
                        'Eliminate pirate MISSION-class submarines',
                        'Protect civilian transport FURY from attack',
                        'Establish Marshall Authority control'
                    ],
                    restrictions: [
                        'Follow military protocols',
                        'No attacks on civilian vessels'
                    ],
                    intel: 'Pirates equipped with stolen MISSION tactical submarines and supported by rogue THUNDER escorts.'
                },
                dialogue_events: [
                    {
                        trigger: 'mission_start',
                        speaker: 'Admiral Hayes',
                        text: 'Captain, these pirates have been hitting civilian convoys for weeks. The other factions are watching how we handle this. Your approach?',
                        choices: [
                            {
                                id: 'by_the_book',
                                text: 'Standard military protocols - minimize civilian risk',
                                consequences: {
                                    reputation: { 'MARSHALL_AUTHORITY': 3, 'PACIFICA_FEDERATION': 2 },
                                    scenario_modifier: { civilian_protection: 1.5, engagement_rules: 'restrictive' }
                                }
                            },
                            {
                                id: 'overwhelming_force',
                                text: 'Show of force - demonstrate Marshall Authority power',
                                consequences: {
                                    reputation: { 'MARSHALL_AUTHORITY': 5, 'MINING_CONSORTIUM': -2 },
                                    scenario_modifier: { firepower_bonus: 1.4, intimidation_factor: true }
                                }
                            },
                            {
                                id: 'diplomatic_solution',
                                text: 'Attempt to negotiate with the pirates first',
                                consequences: {
                                    reputation: { 'PACIFICA_FEDERATION': 4, 'MARSHALL_AUTHORITY': -1 },
                                    dialogue_tree: 'pirate_negotiation'
                                }
                            }
                        ]
                    },
                    {
                        trigger: 'pirate_hail',
                        speaker: 'Pirate Captain Voss',
                        text: 'Marshall ship! We\'re just trying to survive out here. The corporations took everything from us. Stand down and we\'ll let the transport pass.',
                        choices: [
                            {
                                id: 'arrest_demand',
                                text: 'Surrender immediately or face the consequences',
                                consequences: {
                                    reputation: { 'MARSHALL_AUTHORITY': 4 },
                                    combat_intensity: 1.3
                                }
                            },
                            {
                                id: 'offer_amnesty',
                                text: 'Surrender and we\'ll ensure fair treatment',
                                consequences: {
                                    reputation: { 'PACIFICA_FEDERATION': 5, 'MARSHALL_AUTHORITY': 1 },
                                    peaceful_resolution_chance: 0.6
                                }
                            },
                            {
                                id: 'corporate_inquiry',
                                text: 'What corporations? We need details about your grievances',
                                consequences: {
                                    reputation: { 'DEEP_RESEARCH_ALLIANCE': 3 },
                                    intel_bonus: { corporate_corruption_data: true },
                                    dialogue_branch: 'investigation_path'
                                }
                            }
                        ]
                    }
                ],
                setup: {
                    playerStart: { x: -150, y: -40, z: -120, heading: 45 },
                    allies: [
                        {
                            type: 'TEMPEST',
                            name: 'MS-Authority',
                            position: { x: -120, y: -40, z: -100 },
                            behavior: 'command_formation',
                            hull: 200
                        },
                        {
                            type: 'FURY',
                            name: 'Civilian-Transport',
                            position: { x: 200, y: -30, z: 50 },
                            behavior: 'flee_to_safety',
                            hull: 60
                        }
                    ],
                    enemies: [
                        {
                            type: 'MISSION',
                            position: { x: 100, y: -50, z: -80 },
                            behavior: 'pirate_hunter',
                            alertLevel: 'high'
                        },
                        {
                            type: 'MISSION',
                            position: { x: 180, y: -45, z: 20 },
                            behavior: 'intercept',
                            target: 'Civilian-Transport',
                            alertLevel: 'maximum'
                        },
                        {
                            type: 'THUNDER',
                            position: { x: 150, y: -35, z: -40 },
                            behavior: 'escort',
                            alertLevel: 'medium'
                        }
                    ],
                    waypoints: [
                        { id: 'PATROL_ZONE', x: 100, z: -50, radius: 80 },
                        { id: 'SAFETY', x: 300, z: 100, radius: 40 }
                    ],
                    environment: {
                        visibility: 'medium',
                        thermals: 'shipping_lane',
                        depth: 800,
                        ambient_noise: 5
                    }
                },
                victory: {
                    conditions: ['pirates_eliminated', 'civilian_safe', 'zone_secured'],
                    unlocks: 'fw_02_research_escort',
                    reputation: { 'MARSHALL_AUTHORITY': 10, 'PACIFICA_FEDERATION': 5 }
                },
                failure: {
                    conditions: ['civilian_casualties', 'command_ship_lost', 'mission_compromised'],
                    reputation: { 'MARSHALL_AUTHORITY': -15 }
                }
            },

            {
                id: 'fw_02_research_escort',
                name: 'Scientific Expedition',
                faction: 'DEEP_RESEARCH_ALLIANCE',
                briefing: {
                    title: 'Mission 2: Deep Science',
                    background: 'Escort Deep Research Alliance expedition to study abyssal life forms. Corporate forces want to stop this research to protect mining claims.',
                    objectives: [
                        'Escort ADVENTURE research submarine to study site',
                        'Defend against corporate SQUALL fighters',
                        'Allow 10 minutes of uninterrupted research',
                        'Safe extraction of research team'
                    ],
                    restrictions: [
                        'Research vessel cannot defend itself',
                        'Minimize environmental damage'
                    ],
                    intel: 'Corporate fleet includes SQUALL attack submarines and HAILSTORM support vessels.'
                },
                setup: {
                    playerStart: { x: -100, y: -60, z: -80, heading: 90 },
                    allies: [
                        {
                            type: 'ADVENTURE',
                            name: 'Research-Deep',
                            position: { x: -80, y: -60, z: -60 },
                            behavior: 'research_mission',
                            route: [{ x: -80, z: -60 }, { x: 100, z: 0 }, { x: 200, z: 50 }],
                            speed: 4,
                            hull: 100
                        }
                    ],
                    enemies: [
                        {
                            type: 'SQUALL',
                            position: { x: 150, y: -40, z: -20 },
                            behavior: 'intercept',
                            target: 'Research-Deep',
                            alertLevel: 'high'
                        },
                        {
                            type: 'SQUALL',
                            position: { x: 120, y: -50, z: 80 },
                            behavior: 'patrol',
                            alertLevel: 'medium'
                        },
                        {
                            type: 'HAILSTORM',
                            position: { x: 200, y: -30, z: 20 },
                            behavior: 'support',
                            alertLevel: 'medium'
                        }
                    ],
                    waypoints: [
                        { id: 'RESEARCH_SITE', x: 200, z: 50, radius: 30 }
                    ],
                    environment: {
                        visibility: 'low',
                        thermals: 'research_zone',
                        depth: 2500,
                        ambient_noise: 3,
                        research_time: 600 // 10 minutes
                    }
                },
                victory: {
                    conditions: ['research_complete', 'escort_safe', 'enemies_neutralized'],
                    unlocks: 'fw_03_mining_conflict',
                    reputation: { 'DEEP_RESEARCH_ALLIANCE': 15, 'MINING_CONSORTIUM': -10 }
                },
                failure: {
                    conditions: ['research_vessel_destroyed', 'research_interrupted', 'mission_aborted'],
                    reputation: { 'DEEP_RESEARCH_ALLIANCE': -20 }
                }
            }
        ]
    }
};

// Dialogue System for Campaign Scenarios
class DialogueManager {
    constructor() {
        this.currentDialogue = null;
        this.dialogueHistory = [];
        this.activeChoices = [];
        this.campaignConsequences = {};
    }

    triggerDialogue(scenario, triggerType, additionalData = {}) {
        if (!scenario.dialogue_events) return null;

        const dialogueEvent = scenario.dialogue_events.find(event => event.trigger === triggerType);
        if (!dialogueEvent) return null;

        this.currentDialogue = {
            ...dialogueEvent,
            scenario_id: scenario.id,
            trigger_data: additionalData,
            timestamp: Date.now()
        };

        this.showDialogueInterface(this.currentDialogue);
        return this.currentDialogue;
    }

    showDialogueInterface(dialogue) {
        // Create dialogue UI elements
        const dialogueContainer = document.createElement('div');
        dialogueContainer.id = 'dialogue-interface';
        dialogueContainer.style.cssText = `
            position: fixed; top: 20%; left: 50%; transform: translateX(-50%);
            background: rgba(0, 20, 40, 0.95); border: 2px solid #00ff00;
            padding: 20px; border-radius: 10px; max-width: 600px;
            color: #00ff00; font-family: 'Courier New', monospace;
            z-index: 1000; box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
        `;

        const speakerElement = document.createElement('h3');
        speakerElement.textContent = `${dialogue.speaker}:`;
        speakerElement.style.color = '#00ffff';

        const textElement = document.createElement('p');
        textElement.textContent = dialogue.text;
        textElement.style.marginBottom = '20px';

        const choicesContainer = document.createElement('div');
        dialogue.choices.forEach((choice, index) => {
            const choiceButton = document.createElement('button');
            choiceButton.textContent = `${index + 1}. ${choice.text}`;
            choiceButton.style.cssText = `
                display: block; width: 100%; margin: 10px 0; padding: 10px;
                background: rgba(0, 100, 0, 0.3); border: 1px solid #00ff00;
                color: #00ff00; cursor: pointer; font-family: 'Courier New', monospace;
            `;
            choiceButton.addEventListener('click', () => this.makeChoice(choice, dialogue));
            choiceButton.addEventListener('mouseenter', () => {
                choiceButton.style.background = 'rgba(0, 150, 0, 0.5)';
            });
            choiceButton.addEventListener('mouseleave', () => {
                choiceButton.style.background = 'rgba(0, 100, 0, 0.3)';
            });
            choicesContainer.appendChild(choiceButton);
        });

        dialogueContainer.appendChild(speakerElement);
        dialogueContainer.appendChild(textElement);
        dialogueContainer.appendChild(choicesContainer);
        document.body.appendChild(dialogueContainer);

        // Pause game during dialogue
        if (window.gameState) {
            window.gameState.dialoguePaused = true;
        }
    }

    makeChoice(choice, dialogue) {
        // Record choice in history
        this.dialogueHistory.push({
            scenario_id: dialogue.scenario_id,
            speaker: dialogue.speaker,
            choice_id: choice.id,
            choice_text: choice.text,
            timestamp: Date.now()
        });

        // Apply consequences
        this.applyChoiceConsequences(choice.consequences, dialogue.scenario_id);

        // Remove dialogue interface
        const dialogueInterface = document.getElementById('dialogue-interface');
        if (dialogueInterface) {
            dialogueInterface.remove();
        }

        // Resume game
        if (window.gameState) {
            window.gameState.dialoguePaused = false;
        }

        console.log(`🗣️ Choice made: ${choice.text}`);

        // Check for follow-up dialogues
        if (choice.consequences.dialogue_tree || choice.consequences.dialogue_branch) {
            setTimeout(() => {
                this.triggerFollowUpDialogue(choice, dialogue);
            }, 2000);
        }
    }

    applyChoiceConsequences(consequences, scenarioId) {
        // Apply reputation changes
        if (consequences.reputation && window.reputationSystem) {
            for (const [faction, amount] of Object.entries(consequences.reputation)) {
                window.reputationSystem.modifyReputation(faction, amount, `Dialogue choice in ${scenarioId}`);
                console.log(`🏛️ Reputation: ${faction} ${amount > 0 ? '+' : ''}${amount}`);
            }
        }

        // Apply scenario modifiers
        if (consequences.scenario_modifier && window.gameState && window.gameState.currentScenario) {
            window.gameState.currentScenario.modifiers = {
                ...window.gameState.currentScenario.modifiers,
                ...consequences.scenario_modifier
            };
            console.log(`⚙️ Scenario modifiers applied:`, consequences.scenario_modifier);
        }

        // Apply campaign-wide consequences
        if (consequences.campaign_unlock) {
            this.campaignConsequences[consequences.campaign_unlock] = true;
            console.log(`🔓 Campaign unlock: ${consequences.campaign_unlock}`);
        }

        // Store consequences for later reference
        if (!this.campaignConsequences[scenarioId]) {
            this.campaignConsequences[scenarioId] = [];
        }
        this.campaignConsequences[scenarioId].push(consequences);
    }

    triggerFollowUpDialogue(choice, originalDialogue) {
        // Handle branching dialogue trees
        if (choice.consequences.dialogue_tree === 'pirate_negotiation') {
            this.showPirateNegotiationDialogue(originalDialogue);
        }
        // Add more branching dialogue handlers as needed
    }

    showPirateNegotiationDialogue(originalDialogue) {
        const negotiationDialogue = {
            speaker: 'Pirate Captain Voss',
            text: 'You want to talk? Fine. But know this - we lost everything when Titan Corp destroyed our mining settlement. Our families are dead. What can your Marshall Authority offer us now?',
            choices: [
                {
                    id: 'justice_promise',
                    text: 'We\'ll investigate Titan Corp and ensure justice',
                    consequences: {
                        reputation: { 'DEEP_RESEARCH_ALLIANCE': 4, 'MINING_CONSORTIUM': -3 },
                        campaign_unlock: 'titan_corp_investigation'
                    }
                },
                {
                    id: 'amnesty_offer',
                    text: 'Surrender now and we\'ll ensure you get a fair trial',
                    consequences: {
                        reputation: { 'MARSHALL_AUTHORITY': 2, 'PACIFICA_FEDERATION': 3 },
                        peaceful_resolution_chance: 0.8
                    }
                },
                {
                    id: 'employment_offer',
                    text: 'Join Marshall Authority - use your skills legally',
                    consequences: {
                        reputation: { 'MARSHALL_AUTHORITY': 5 },
                        ally_recruitment: 'reformed_pirates'
                    }
                }
            ],
            scenario_id: originalDialogue.scenario_id
        };

        setTimeout(() => {
            this.showDialogueInterface(negotiationDialogue);
        }, 1000);
    }

    getDialogueHistory(scenarioId = null) {
        if (scenarioId) {
            return this.dialogueHistory.filter(entry => entry.scenario_id === scenarioId);
        }
        return this.dialogueHistory;
    }

    getCampaignConsequences() {
        return this.campaignConsequences;
    }
}

// Campaign Management System
class CampaignManager {
    constructor() {
        this.currentCampaign = null;
        this.currentScenario = 0;
        this.dialogueManager = new DialogueManager();
        this.progress = {
            completed_scenarios: [],
            unlocked_campaigns: ['ARCTIC_SHADOW'],
            achievements: [],
            submarine_upgrades: []
        };
        this.loadProgress();
    }

    startCampaign(campaignId) {
        if (!this.isCampaignUnlocked(campaignId)) {
            console.warn(`Campaign ${campaignId} is not unlocked`);
            return false;
        }

        this.currentCampaign = campaignId;
        this.currentScenario = 0;
        console.log(`Starting campaign: ${CAMPAIGNS[campaignId].name}`);
        return true;
    }

    getCurrentScenario() {
        if (!this.currentCampaign) return null;
        const campaign = CAMPAIGNS[this.currentCampaign];
        return campaign.scenarios[this.currentScenario];
    }

    // Trigger dialogue events during scenario
    triggerDialogueEvent(triggerType, additionalData = {}) {
        const scenario = this.getCurrentScenario();
        if (!scenario) return null;

        return this.dialogueManager.triggerDialogue(scenario, triggerType, additionalData);
    }

    // Start scenario with initial dialogue
    startScenarioWithDialogue(scenarioId) {
        const scenario = this.findScenario(scenarioId);
        if (!scenario) return false;

        // Start the scenario normally
        this.currentScenario = 0;

        // Trigger initial dialogue if available
        setTimeout(() => {
            this.triggerDialogueEvent('mission_start');
        }, 1000);

        return true;
    }

    completeScenario(scenarioId, success = true) {
        if (!success) {
            console.log(`Scenario ${scenarioId} failed - can retry`);
            return false;
        }

        // Mark as completed
        if (!this.progress.completed_scenarios.includes(scenarioId)) {
            this.progress.completed_scenarios.push(scenarioId);
        }

        // Get scenario data for unlocks/rewards
        const scenario = this.findScenario(scenarioId);
        if (scenario && scenario.victory.unlocks) {
            if (scenario.victory.unlocks === 'campaign_complete') {
                this.completeCampaign(this.currentCampaign);
            } else {
                // Unlock next scenario
                this.currentScenario++;
            }
        }

        // Apply rewards
        if (scenario && scenario.victory.rewards) {
            scenario.victory.rewards.forEach(reward => {
                this.applyReward(reward);
            });
        }

        this.saveProgress();
        return true;
    }

    completeCampaign(campaignId) {
        const campaign = CAMPAIGNS[campaignId];
        console.log(`Campaign completed: ${campaign.name}`);

        // Apply campaign completion rewards
        if (campaign.completion_reward.unlocks) {
            campaign.completion_reward.unlocks.forEach(unlock => {
                if (unlock.startsWith('campaign:')) {
                    const newCampaignId = unlock.split(':')[1];
                    if (!this.progress.unlocked_campaigns.includes(newCampaignId.toUpperCase())) {
                        this.progress.unlocked_campaigns.push(newCampaignId.toUpperCase());
                        console.log(`Unlocked new campaign: ${newCampaignId}`);
                    }
                }
            });
        }

        // Add achievements
        if (campaign.completion_reward.achievements) {
            campaign.completion_reward.achievements.forEach(achievement => {
                if (!this.progress.achievements.includes(achievement)) {
                    this.progress.achievements.push(achievement);
                }
            });
        }

        this.saveProgress();
    }

    findScenario(scenarioId) {
        for (const campaignId in CAMPAIGNS) {
            const campaign = CAMPAIGNS[campaignId];
            const scenario = campaign.scenarios.find(s => s.id === scenarioId);
            if (scenario) return scenario;
        }
        return null;
    }

    isCampaignUnlocked(campaignId) {
        return this.progress.unlocked_campaigns.includes(campaignId);
    }

    applyReward(reward) {
        if (reward.startsWith('achievement:')) {
            const achievement = reward.split(':')[1];
            if (!this.progress.achievements.includes(achievement)) {
                this.progress.achievements.push(achievement);
                console.log(`Achievement unlocked: ${achievement}`);
            }
        } else if (reward.startsWith('submarine_upgrade:')) {
            const upgrade = reward.split(':')[1];
            if (!this.progress.submarine_upgrades.includes(upgrade)) {
                this.progress.submarine_upgrades.push(upgrade);
                console.log(`Submarine upgrade unlocked: ${upgrade}`);
            }
        }
    }

    saveProgress() {
        localStorage.setItem('subwar_campaign_progress', JSON.stringify(this.progress));
    }

    loadProgress() {
        const saved = localStorage.getItem('subwar_campaign_progress');
        if (saved) {
            this.progress = { ...this.progress, ...JSON.parse(saved) };
        }
    }

    // Get scenario setup for game initialization
    getScenarioSetup(scenarioId) {
        const scenario = this.findScenario(scenarioId);
        return scenario ? scenario.setup : null;
    }

    // Check victory conditions during gameplay
    checkVictoryConditions(scenarioId, gameState) {
        const scenario = this.findScenario(scenarioId);
        if (!scenario) return false;

        // This would be implemented with actual game state checking
        // For now, return structure for implementation
        return {
            scenario: scenario,
            conditions: scenario.victory.conditions,
            check: (gameState) => {
                // Implementation would check each condition against game state
                // e.g., "reach_waypoint:NAV-1", "enemies_destroyed:2", etc.
                return false; // Placeholder
            }
        };
    }
}

// Global campaign manager instance
window.campaignManager = new CampaignManager();
window.dialogueManager = window.campaignManager.dialogueManager;

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CAMPAIGNS, CampaignManager, DialogueManager };
}

// Global dialogue trigger functions for game integration
window.triggerDialogue = function(triggerType, additionalData = {}) {
    if (window.campaignManager) {
        return window.campaignManager.triggerDialogueEvent(triggerType, additionalData);
    }
    return null;
};

window.getDialogueHistory = function(scenarioId = null) {
    if (window.dialogueManager) {
        return window.dialogueManager.getDialogueHistory(scenarioId);
    }
    return [];
};

window.getCampaignConsequences = function() {
    if (window.dialogueManager) {
        return window.dialogueManager.getCampaignConsequences();
    }
    return {};
};

console.log('Campaign system loaded - Arctic Shadow campaign available');
console.log('🗣️ Dialogue system activated - Multiple choice scenarios ready');
