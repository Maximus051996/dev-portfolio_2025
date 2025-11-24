export interface SocialLink {
name: string;
url: string;
icon?: string; // e.g. 'github', 'linkedin'
}


export interface Bio {
fullName: string;
title: string;
summary: string;
avatar: string; // path under assets
socials: SocialLink[];
}
